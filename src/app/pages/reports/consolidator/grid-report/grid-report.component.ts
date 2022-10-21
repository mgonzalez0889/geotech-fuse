import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormReportComponent } from '../form-report/form-report.component';
import { HistoriesService } from '../../../../core/services/histories.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { ReportsService } from 'app/core/services/reports.service';
import { SettingsService } from 'app/core/services/settings.service';
import moment from 'moment';

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
    @ViewChild('paginatorConsolidator') paginatorConsolidator: MatPaginator;
    @ViewChild('paginatorTrips') paginatorTrips: MatPaginator;
    public displayedColumns: string[] = [
        'plate',
        'fecha_inicial',
        'direccion_inicial',
        'fecha_final',
        'direccion_final',
        'viajes',
        'tiempo',
        'paradas',
        'paradas_tiempo',
        'ver_detalle',
    ];
    public subscription$: Subscription;
    public dataSourceConsolidator: MatTableDataSource<any>;
    public dataSourceTrips: MatTableDataSource<any>;
    public messageExceedTime: boolean = true;
    public messageNoReport: boolean = false;
    public dataConsolidator: any = {};

    titleReport: string;
    detailTrip: boolean = false;
    private dataReport: any[] = [];

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService,
        public mapFunctionalitieService: MapFunctionalitieService,
        private reportService: ReportsService,
        public settingsService: SettingsService
    ) {}

    ngOnInit(): void {
        this.listenObservablesReport();
        this.messageExceedTime = true;
        this.titleReport = 'Consolidado de viajes';
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
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

    goDetail(data: any): void {
        this.detailTrip = true;
        const trips = this.dataReport.filter(
            (x: any) => x.plate === data.plate
        );
        this.dataConsolidator = data;
        this.dataSourceTrips = new MatTableDataSource(trips);
        this.dataSourceTrips.paginator = this.paginatorTrips;
    }

    /**
     * @description: Escucha el observable behavior y realiza llamada a la API para generar reporte
     */
    private listenObservablesReport(): void {
        this.subscription$ =
            this._historicService.behaviorSubjectDataFormsTrip.subscribe(
                ({ payload }) => {
                    if (payload) {
                        const dateStart = new Date(payload.date_init).getTime();
                        const dateEnd = new Date(payload.date_end).getTime();
                        const diff = dateStart - dateEnd;
                        if (Number(diff / (1000 * 60 * 60 * 24)) < 91) {
                            payload.date_init =
                                moment(payload.date_init).format('DD/MM/YYYY') +
                                ' 00:00:00';

                            payload.date_end =
                                moment(payload.date_end).format('DD/MM/YYYY') +
                                ' 23:59:00';
                            this.messageExceedTime = true;
                            this.subscription$ = this._historicService
                                .getHistoriesTrip(payload)
                                .subscribe((res) => {
                                    if (res.code === 400) {
                                        this.messageNoReport = false;
                                        this.dataSourceConsolidator = null;
                                    } else {
                                        this.dataReport = res.trips;
                                        this.messageNoReport = true;
                                        this.dataSourceConsolidator =
                                            new MatTableDataSource(res.data);
                                        this.dataSourceConsolidator.paginator =
                                            this.paginatorConsolidator;
                                        // console.log(this.dataSource);
                                    }
                                });
                        }
                    } else {
                        this.dataSourceConsolidator = null;
                        this.messageExceedTime = false;
                    }
                }
            );
    }

    /**
     * @description: Exportar .CSV
     */
    private downloadReport(res: any): void {}
}
