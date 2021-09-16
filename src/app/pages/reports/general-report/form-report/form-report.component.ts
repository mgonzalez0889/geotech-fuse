import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MobileService} from "../../../../core/services/mobile.service";
import {Subscription} from "rxjs";
import {EventsService} from "../../../../core/services/events.service";
import {DaterangepickerDirective} from "ngx-daterangepicker-material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


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

    @ViewChild(DaterangepickerDirective, {static: false}) pickerDirective: DaterangepickerDirective;


    constructor(
        public dialogRef: MatDialogRef<FormReportComponent>,
        @Inject(MAT_DIALOG_DATA) public message: any,
        private _mobileService: MobileService,
        private _eventsService: EventsService,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.mobileList();
        this.eventsList();
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
                console.log(data.data);
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
                console.log(data.data);
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
                id: undefined,
                full_name: ['', [Validators.required]],
                owner_event_id: [''],
                date_init: [''],
                date_end: [''],
                plate: ['']
            }
        );
    }
}
