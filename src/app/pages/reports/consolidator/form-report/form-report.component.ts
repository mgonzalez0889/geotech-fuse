/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MobileService } from '../../../../core/services/mobile.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { HistoriesService } from '../../../../core/services/histories.service';
import moment from 'moment';

export interface CalendarSettings {
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'll';
    timeFormat: '12' | '24';
    startWeekOn: 6 | 0 | 1;
}

@Component({
    selector: 'app-form-report',
    templateUrl: './form-report.component.html',
    styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit {
    public form: FormGroup;
    public select: boolean;
    public fleets$: Observable<any>;
    public events$: Observable<any>;
    public mobiles$: Observable<any>;
    public initialHours: string = '00:00:00';
    public finalHours: string = '23:59:00';
    public initialDate: Date = new Date();
    public finalDate: Date = new Date();
    plates: [];

    constructor(
        public dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any,
        private _mobileService: MobileService,
        private _historicService: HistoriesService
    ) {}

    ngOnInit(): void {
        this.getMobiles();
    }

    /**
     * @description: Obtiene los eventos
     */
    private getMobiles(): void {
        this.mobiles$ = this._mobileService.getMobiles();
    }
    // moment(this.initialDate).format('DD/MM/YYYY') + ' 00:00:00',
    // moment(this.finalDate).format('DD/MM/YYYY') + ' 23:59:59',
    /**
     * @description: Genera el reporte
     */
    public onSelect(): void {
        const data = {
            date_init: this.initialDate,
            date_end: this.finalDate,
            plates: this.plates,
        };
        this._historicService.behaviorSubjectDataFormsTrip.next({
            payload: data,
        });
    }
}
