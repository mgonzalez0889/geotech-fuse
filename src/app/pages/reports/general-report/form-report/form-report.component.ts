/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MobileService } from '../../../../core/services/mobile.service';
import { Observable } from 'rxjs';
import { EventsService } from '../../../../core/services/events.service';
import { HistoriesService } from '../../../../core/services/histories.service';
import { FleetsService } from '../../../../core/services/fleets.service';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    public formReport: FormGroup = this.formBuilder.group({});
    public select: boolean;
    public fleets$: Observable<any>;
    public events$: Observable<any>;
    public mobiles$: Observable<any>;
    public initialHours: string = '00:00:00';
    public finalHours: string = '23:59:00';
    public initialDate: Date = new Date();
    public finalDate: Date = new Date();
    plates: [];
    flotas: [];
    eventos: [];

    selectTrasport: string = '';
    listTrasport: { name: string; text: string }[] = [
        {
            name: 'mobiles',
            text: 'Moviles',
        },
        {
            name: 'fleet',
            text: 'Flota',
        },
    ];

    constructor(
        public dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any,
        private _mobileService: MobileService,
        private _eventsService: EventsService,
        private _historicService: HistoriesService,
        private _fleetsServices: FleetsService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this.events$ = this._eventsService.getEvents();
    }

    public buildForm(): void {
        this.formReport = this.formBuilder.group({
            date_init: [new Date(), [Validators.required]],
            date_end: [new Date(), [Validators.required]],
            plates: [[]],
        });
    }

    /**
     * @description: Genera el reporte
     */
    public onSelect(): void {
        const data = {
            date_init: this.initialDate,
            date_end: this.finalDate,
            plates: this.plates,
            events: this.eventos,
            fleets: this.flotas,
            limit: 999999999,
            page: 1,
            validationFleet: Number(this.selectTrasport),
        };
        this._historicService.behaviorSubjectDataForms.next({ payload: data });
    }

    /**
     * @description se carga la informacion en el mat-select dependiendo del tipo de trasporte
     */
    public onChangeTrasport({ value }: MatRadioChange): void {
        if (value === 'mobiles') {
            this.select = true;
            this.mobiles$ = this._mobileService.getMobiles();
            this.flotas = [];
        } else if (value === 'fleet') {
            this.select = false;
            this.fleets$ = this._fleetsServices.getFleets();
            this.plates = [];
        }
        this.selectTrasport = value;
    }
}
