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
    public dataHistoric: any;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService,
    ) {
    }

    ngOnInit(): void {
        this.listenObservables();
        this.messageExceedTime = true;
    }

    /**
     * @description: Apertura del cuadro de dialogo
     */
    public onReport(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        /*      dialogConfig.height = '600px';
                dialogConfig.width = '460px';*/
        this.dialog.open(FormReportComponent, dialogConfig);
    }

    /**
     * @description: Escucha el observable behavior y realiza llamada a la API
     */
    private listenObservables(): void {
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
     * @description: Exportar .CSV
     */
    public downloadReport(): void {
        this.subscription$ = this._historicService.subjectDataForms.subscribe(({payload}) => {
            this._historicService.getHistoricExport(payload).subscribe((res) => {
                const data = res.map(row => ({
                    Placa: row.plate,
                    Fecha: row.updated_at,
                    Evento: row.name_event,
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
                a.setAttribute('descargar', 'Report.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });
    }

    /**
     * @description: Paginacion
     */
    public pageChange($event: PageEvent) {
        //console.log('esto es event', $event);
    }

    /**
     * @description: Destruye las subscripciones
     */
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
        console.log('destruido')
    }


}
