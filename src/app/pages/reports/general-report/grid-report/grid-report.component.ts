import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormReportComponent} from "../form-report/form-report.component";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss']
})
export class GridReportComponent implements OnInit, OnDestroy {

    public displayedColumns: string[] = ['plate', 'date_event', 'event_name', 'address', 'x', 'y', 'speed', 'battery', 'vew_map'];
    public subscription$: Subscription;
    public dataSource: MatTableDataSource<any>;
    public messageExceedTime: boolean = true;
    public messageNoReport: boolean = false;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService,
    ) {
    }

    ngOnInit(): void {
        this.listenObservablesReport();
        this.messageExceedTime = true;
    }

    /**
     * @description: Apertura del cuadro de dialogo
     */
    public onReport(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(FormReportComponent, dialogConfig);
    }

    /**
     * @description: Escucha el observable behavior y realiza llamada a la API para generar reporte
     */
    private listenObservablesReport(): void {
        this.subscription$ = this._historicService.subjectDataForms.subscribe(({payload}) => {
            const daysMils = 86400000;
            const diff = payload.date?.date_end.getTime() - payload.date?.date_init.getTime();
            const days = diff / daysMils;
            if (days < 91) {
                this.messageExceedTime = true;
                if (payload.radioButton == 1) {
                    this.subscription$ = this._historicService.getHistoricPlate(payload).subscribe((res) => {
                        this.generateReport(res);
                    });
                } else {
                    this.subscription$ = this._historicService.getGistoricFleet(payload).subscribe((res) => {
                        this.generateReport(res);
                    });
                }
            } else {
                this.dataSource = null;
                this.messageExceedTime = false;
            }
        });
    }

    /**
     * @description: Genera reporte por flota y por vehiculo
     */
    private generateReport(res): void {
        let plate: string = '';
        const historic: any = [];
        for (const data of res) {
            plate = data.plate;
            data.historic_report.map((x) => {
                x['plate'] = plate;
                return x;
            });
            data.historic_report.forEach((m) => {
                historic.push(m);
            });
        }
        if (historic.length) {
            this.messageNoReport = true;
        } else {
            this.messageNoReport = false;
        }
        this.dataSource = new MatTableDataSource(historic);
        this.dataSource.paginator = this.paginator;
    }

    /**
     * @description: Escucha el observable behavior y valida si genera el reporte por flota o vehiculo
     */
    public listenObservablesExport(): void {
        this.subscription$ = this._historicService.subjectDataForms.subscribe(({payload}) => {
            if (payload.radioButton == 1) {
                this._historicService.getHistoricExportMovile(payload).subscribe((res) => {
                    this.downloadReport(res);
                });
            } else {
                this._historicService.getHistoricExportFleet(payload).subscribe((res) => {
                    this.downloadReport(res);
                });
            }
        });
    }

    /**
     * @description: Exportar .CSV
     */
    private downloadReport(res: any): void {
        let plate: string = '';
        const historic: any = [];
        for (const data1 of res) {
            plate = data1.plate;
            data1.historic_report.map((x) => {
                x['plate'] = plate;
                return x;
            });
            data1.historic_report.forEach((m) => {
                historic.push(m);
            });
        }
        const data = historic.map(row => ({
            Placa: row.plate,
            Fecha: row.date_event,
            Evento: row.event_name,
            Direccion: row.address,
            Latitud: row.x,
            Longitud: row.y,
            Velocidad: row.speed,
            Bateria: row.battery
        }));
        let values;
        const csv: any = [];
        const csvTemp: any = [];
        const headers = Object.keys(data[0]);
        csvTemp.push(headers.join(','));
        for (const row of data) {
            values = headers.map(header => row[header]);
            csvTemp.push(values.join(','));
        }
        csv.push(csvTemp.join('\n'));
        const blob = new Blob([csv], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'Report.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    /**
     * @description: Destruye las subscripciones
     */
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }
}
