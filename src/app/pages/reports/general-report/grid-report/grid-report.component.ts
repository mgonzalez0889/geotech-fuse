import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormReportComponent } from '../form-report/form-report.component';
import { HistoriesService } from '../../../../core/services/histories.service';
import { Subscription } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import moment from 'moment';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
    public displayedColumns: string[] = [
        'plate',
        'date_event',
        'event_name',
        'address',
        'x',
        'y',
        'speed',
        'battery',
        'vew_map',
    ];
    public subscription$: Subscription;
    public dataSource: MatTableDataSource<any>;
    public messageExceedTime: boolean = true;
    public messageNoReport: boolean = false;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    titleReport: string;

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService,
        public mapFunctionalitieService: MapFunctionalitieService
    ) {}

    ngOnInit(): void {
        this.listenObservablesReport();
        this.messageExceedTime = true;

        this.titleReport = 'Historico y eventos';
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
        this.subscription$ =
            this._historicService.behaviorSubjectDataForms.subscribe(
                ({ payload }) => {
                    if (payload) {
                        var fechaInicio = new Date(
                            payload?.date_init
                        ).getTime();
                        var fechaFin = new Date(payload?.date_end).getTime();

                        var diff = fechaFin - fechaInicio;
                        if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
                            this.messageExceedTime = true;
                            this.subscription$ = this._historicService
                                .getHistories(payload)
                                .subscribe((res) => {
                                    if (res.code === 400) {
                                        this.messageNoReport = false;
                                        this.dataSource = null;
                                    } else {
                                        this.messageNoReport = true;
                                        this.dataSource =
                                            new MatTableDataSource(res.data);
                                        this.dataSource.paginator =
                                            this.paginator;
                                    }
                                });
                        }
                    } else {
                        this.dataSource = null;
                        this.messageExceedTime = false;
                    }
                }
            );
    }

    /**
     * @description: Escucha el observable behavior y valida si genera el reporte por flota o vehiculo
     */
    public listenObservablesExport(): void {
        this.subscription$ =
            this._historicService.behaviorSubjectDataForms.subscribe(
                ({ payload }) => {
                    if (payload.radioButton == 1) {
                        this._historicService
                            .getHistoricExportMovile(payload)
                            .subscribe((res) => {
                                this.downloadReport(res.data);
                            });
                    } else {
                        this._historicService
                            .getHistoricExportFleet(payload)
                            .subscribe((res) => {
                                this.downloadReport(res.data);
                            });
                    }
                }
            );
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
        const data = historic.map((row) => ({
            Placa: row.plate,
            Fecha: row.date_event,
            Evento: row.event_name,
            Direccion: row.address,
            Latitud: row.x,
            Longitud: row.y,
            Velocidad: row.speed,
            Bateria: row.battery,
        }));
        let values;
        const csv: any = [];
        const csvTemp: any = [];
        const headers = Object.keys(data[0]);
        csvTemp.push(headers.join(','));
        for (const row of data) {
            values = headers.map((header) => row[header]);
            csvTemp.push(values.join(','));
        }
        csv.push(csvTemp.join('\n'));
        const blob = new Blob([csv], { type: 'text/csv' });
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
