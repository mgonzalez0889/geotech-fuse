import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MobileService} from "../../../../core/services/mobile.service";
import {Observable, Subscription} from "rxjs";
import {EventsService} from "../../../../core/services/events.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HistoriesService} from "../../../../core/services/histories.service";

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
    public subscription$: Subscription;
    public form: FormGroup;
    public events$: Observable<any>;
    public mobiles$: Observable<any>;
    public settings: CalendarSettings;

    constructor(
        public dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any,
        private _mobileService: MobileService,
        private _eventsService: EventsService,
        private fb: FormBuilder,
        private _historicService: HistoriesService
    ) {
    }

    ngOnInit(): void {
        this.createReportForm();
        this.getEvents();
        this.getMobiles();
    }

    /**
     * @description: Creacion de los datos del formulario de reporte
     */
    private createReportForm(): void {
        this.form = this.fb.group({
                owner_event_id: [''],
                plate: [''],
                date: this.fb.group({
                    date_init: '',
                    date_end: ''
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
     * @description: Obtiene los eventos
     */
    private getMobiles(): void {
        this.mobiles$ = this._mobileService.getMobiles();
    }

    /**
     * @description: Genera el reporte
     */
    public onSelect(): void {
        const data = this.form.getRawValue();
        this.getHistoric(data);
    }
    /**
     * @description: Obtiene los datos de la api reporte
     */
    private getHistoric(data: any): void {
        this.subscription$ = this._historicService.historicPages(data).subscribe((res) => {
            this._historicService.subjectDataHistories.next({payload: res, show: true});
        });
    }

}
