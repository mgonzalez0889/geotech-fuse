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
    flotas: [];
    eventos: [];
    validationFleet;

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
        this.getEvents();
    }

    /**
     * @description: Obtiene los eventos
     */
    private getEvents(): void {
        this.events$ = this._eventsService.getEvents();
    }

    /**
     * @description: Genera el reporte
     */
    public onSelect(): void {
        let data = {
            date_init:
                moment(this.initialDate).format('DD/MM/YYYY') + ' 00:00:00',
            date_end: moment(this.finalDate).format('DD/MM/YYYY') + ' 23:59:59',
            plates: this.plates,
            events: this.eventos,
            fleets: this.flotas,
            limit: 999999999,
            page: 1,
            validationFleet: Number(this.validationFleet),
        };
        this._historicService.behaviorSubjectDataForms.next({ payload: data });
    }

    /**
     * @description: Manejador de estados Moviles / Flotas
     */
    public onchange(event: MatRadioChange): void {
        if (event.value == 1) {
            this.select = true;
            this.mobiles$ = this._mobileService.getMobiles();
            this.flotas = [];
            this.validationFleet = 0;
        } else {
            this.select = false;
            this.fleets$ = this._fleetsServices.getFleets();
            this.plates = [];
            this.validationFleet = 1;
        }
    }
}
