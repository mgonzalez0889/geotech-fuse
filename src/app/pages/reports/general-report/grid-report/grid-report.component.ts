/* eslint-disable @typescript-eslint/naming-convention */
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
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
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
    public dataSendTimeLine: any;
    public messageExceedTime: boolean = true;
    public messageNoReport: boolean = false;
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

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    /**
     * @description: parseamos la data del form y la enviamos por query por la ruta de time line
     */
    public viewReportTimeLine(): void {
        let queryParams: string = '?';
        Object.entries(this.dataSendTimeLine).forEach(([key, value]) => {
            queryParams += `${key}=${value}&`;
        });
        window.open(`/app/reports/general-report/time-line${queryParams}`);
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
     * @description: Escucha el observable behavior y valida si genera el reporte por flota o vehiculo
     */
    public listenObservablesExport(): void {
        this.subscription$ =
            this._historicService.behaviorSubjectDataForms.subscribe(
                ({ payload }) => {
                    if (+payload.radioButton === 1) {
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
     * @description: Escucha el observable behavior y realiza llamada a la API para generar reporte
     */
    private listenObservablesReport(): void {
        this.subscription$ =
            this._historicService.behaviorSubjectDataForms.subscribe(
                ({ payload }) => {
                    if (payload) {
                        const dateStart = new Date(payload.date_init).getTime();
                        const dateEnd = new Date(payload.date_end).getTime();
                        const diff = dateStart - dateEnd;

                        if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
                            this.messageExceedTime = true;

                            payload.date_init =
                                moment(payload.date_init).format('DD/MM/YYYY') +
                                ' 00:00:00';

                            payload.date_end =
                                moment(payload.date_end).format('DD/MM/YYYY') +
                                ' 23:59:00';

                            this.dataSendTimeLine = payload;
                            console.log(payload);

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
        const data = historic.map((row: any) => ({
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
            values = headers.map((header: any) => row[header]);
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
}
