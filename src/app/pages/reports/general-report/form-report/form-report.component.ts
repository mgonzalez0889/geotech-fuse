import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MobileService} from "../../../../core/services/mobile.service";
import {Observable, Subscription} from "rxjs";
import {EventsService} from "../../../../core/services/events.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HistoriesService} from "../../../../core/services/histories.service";
import {FleetsService} from "../../../../core/services/fleets.service";
import {MatRadioChange} from "@angular/material/radio";

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

    constructor(
        public dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any,
        private _mobileService: MobileService,
        private _eventsService: EventsService,
        private fb: FormBuilder,
        private _historicService: HistoriesService,
        private _fleetsServices: FleetsService
    ) {
    }

    ngOnInit(): void {
        this.createReportForm();
        this.getEvents();
    }

    /**
     * @description: Creacion de los datos del formulario de reporte
     */
    private createReportForm(): void {
        this.form = this.fb.group({
                owner_event_id: [''],
                plate: [''],
                fleet_id: [''],
                radioButton: [''],
                date: this.fb.group({
                    date_init: [''],
                    date_end: ['']
                })
            }
        );
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
        const data = this.form.getRawValue();
        this._historicService.subjectDataForms.next({payload: data});
    }

    /**
     * @description: Manejador de estados Moviles / Flotas
     */
    public onchange(event: MatRadioChange): void {
        if (event.value == 1) {
            this.select = true;
            this.mobiles$ = this._mobileService.getMobiles();
            this.form.controls.fleet_id.reset();
        } else {
            this.select = false;
            this.fleets$ = this._fleetsServices.getFleets();
            this.form.controls.plate.reset();
        }
    }
}
