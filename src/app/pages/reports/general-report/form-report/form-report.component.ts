import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MobileService} from "../../../../core/services/mobile.service";
import {Observable, Subscription} from "rxjs";
import {EventsService} from "../../../../core/services/events.service";
import {DaterangepickerDirective} from "ngx-daterangepicker-material";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Browser} from "leaflet";
export interface CalendarSettings
{
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

    public dropdownListMobile = [];
    public dropdownSettingsMobile = {};
    public dropdownListEvent = [];
    public dropdownSettingsEvent = {};
    public subscription$: Subscription;
    public selected: any;
    public form: FormGroup;
    public subscription: Subscription;
    public events$: Observable<any>;
    public mobiles$: Observable<any>;
    public settings: CalendarSettings;


    @ViewChild(DaterangepickerDirective, {static: false}) pickerDirective: DaterangepickerDirective;

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
        this.mobileList();
        this.eventsList();
        this.createReportForm();
        this.getEvents();
        this.getMobiles();

    }

    /**
     * @description: Abre calendario
     */
    public openDatepicker(): void {
        this.pickerDirective.open();
    }

    /**
     * @description: Lista desplegable de vehiculos
     */
    private mobileList(): void {
        this.dropdownSettingsMobile = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Desmarcar seleccion',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            searchPlaceholderText: 'Buscar movil',
            noDataAvailablePlaceholderText: 'No se encontraron datos',
            maxHeight: 100
        };
        const tmp = [];
        this.subscription$ = this._mobileService.getMobiles().subscribe((data) => {
            for (let i = 0; i < data.data.length; i++) {
                tmp.push({item_id: i, item_text: data.data[i].plate});
            }
            return this.dropdownListMobile = tmp;
        });
    }

    /**
     * @description: Lista desplegable de eventos
     */
    private eventsList(): void {
        this.dropdownSettingsEvent = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Desmarcar seleccion',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            searchPlaceholderText: 'Buscar evento',
            noDataAvailablePlaceholderText: 'No se encontraron datos',
            maxHeight: 100
        };
        const tmp = [];
        this.subscription$ = this._eventsService.getEvents().subscribe((data) => {
            for (let i = 0; i < data.data.length; i++) {
                tmp.push({item_id: i, item_text: data.data[i].name});
            }
            return this.dropdownListEvent = tmp;
        });
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
        this.subscription = this._historicService.getHistories(data).subscribe((res) => {
            this._historicService.subjectDataHistories.next({payload: res, show: true});
        });
    }
}
