import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IOptionTable } from 'app/core/interfaces/components/table.interface';
import { HistoriesService } from 'app/core/services/histories.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { FormReportComponent } from '../form-report/form-report.component';
import { IButtonTable } from '../../../../core/interfaces/components/table.interface';

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss'],
})
export class GridReportComponent implements OnInit, OnDestroy {
    public titlePage: string = 'Historico y eventos';
    public historicData: any[] = [];
    public subscription$: Subscription;
    public messageNoReport: boolean = false;
    public dataSendTimeLine: any;
    public buttonTableOption: IButtonTable = {
        icon: 'feather:map',
        text: 'ver mapa',
    };
    public optionsTable: IOptionTable[] = [
        {
            name: 'plate',
            text: 'Placa',
            typeField: 'text',
        },
        {
            name: 'date_entry',
            text: 'Fecha',
            typeField: 'date',
        },
        {
            name: 'event_name',
            text: 'Evento',
            typeField: 'text',
        },
        {
            name: 'address',
            text: 'Dirección',
            typeField: 'text',
        },
        {
            name: 'x',
            text: 'Latitud',
            typeField: 'text',
        },
        {
            name: 'y',
            text: 'Longitud',
            typeField: 'text',
        },
        {
            name: 'speed',
            text: 'Velocidad',
            typeField: 'text',
        },
        {
            name: 'battery',
            text: 'Batería',
            typeField: 'percentage',
        },
    ];

    public displayedColumns: string[] = this.optionsTable
        .map(({ name }) => name)
        .concat('action');

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService
    ) {}

    ngOnInit(): void {
        this.listenObservablesReport();
    }

    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

    viewMap(data: any): void {
        window.open(`https://maps.google.com/?q=${data.x},${data.y}`);
    }

    public viewReportTimeLine(): void {
        let queryParams: string = '?';
        Object.entries(this.dataSendTimeLine).forEach(([key, value]) => {
            queryParams += `${key}=${value}&`;
        });
        window.open(`/app/reports/general-report/time-line${queryParams}`);
    }

    public onReport(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.dialog.open(FormReportComponent, dialogConfig);
    }

    private listenObservablesReport(): void {
        this.subscription$ =
            this._historicService.behaviorSubjectDataForms.subscribe(
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

                            this.subscription$ = this._historicService
                                .getHistories(payload)
                                .subscribe((res) => {
                                    if (res.code === 400) {
                                        this.messageNoReport = false;
                                        this.historicData = [];
                                    } else {
                                        this.messageNoReport = true;

                                        this.historicData = res.data;
                                    }
                                });
                        }
                    } else {
                        this.historicData = [];
                    }
                }
            );
    }
}
