import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MobileService } from '../../../../core/services/mobile.service';
import { Observable, Subscription } from 'rxjs';
import { EventsService } from '../../../../core/services/events.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistoriesService } from '../../../../core/services/histories.service';
import { FleetsService } from '../../../../core/services/fleets.service';
import { MatRadioChange } from '@angular/material/radio';
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
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialHours: string = '00:00:00';
    public finalHours: string = '23:59:00';
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    plates: [];

    constructor(
        public dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any,
        private _mobileService: MobileService,
        private _eventsService: EventsService,
        private fb: FormBuilder,
        private _historicService: HistoriesService,
        private _fleetsServices: FleetsService
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

    /**
     * @description: Genera el reporte
     */
    public onSelect(): void {
        let data = {
            date_init:
                moment(this.initialDate).format('YYYY-MM-DD') + ' 00:00:00',
            date_end: moment(this.finalDate).format('YYYY-MM-DD') + ' 23:59:59',
            plates: this.plates,
        };
        this._historicService.behaviorSubjectDataFormsTrip.next({
            payload: data,
        });
    }
}
