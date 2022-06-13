import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from "rxjs";
import {EventsService} from "../../../../core/services/events.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ContactService} from "../../../../core/services/contact.service";

@Component({
    selector: 'app-form-events',
    templateUrl: './form-events.component.html',
    styleUrls: ['./form-events.component.scss']
})
export class FormEventsComponent implements OnInit, OnDestroy {

    @Output() onShow: EventEmitter<boolean> = new EventEmitter<boolean>();
    public form: FormGroup;
    public subscription$: Subscription;
    public contacs: boolean = false;
    public dropdownList = [];
    public dropdownSettings = {};


    constructor(
        private fb: FormBuilder,
        private _eventsServices: EventsService,
        private _snackBar: MatSnackBar,
        private _contacsService: ContactService
    ) {
        this.createEventsForm();
    }

    ngOnInit(): void {
        this.listenObservables();
        this.contacsList();
        this.dataCotact();
    }

    /**
     * @description: Cierra formulario
     */
    public onClose(): void {
        this.onShow.emit(false);
    }

    /**
     * @description: Formulario de modulo eventos
     */
    private createEventsForm(): void {
        this.form = this.fb.group({
            id: undefined,
            name: ['', [Validators.required]],
            color: ['', [Validators.required]],
            description: ['', [Validators.required]],
            checkNotificationEmail: [''],
        });
    }

    /**
     * @description: Editar un evento
     */
    public editEvent(): void {
        const data = this.form.getRawValue();
        this.subscription$ = this._eventsServices.putEvents(data).subscribe(() => {
            this._snackBar.open('Evento actualizado con exito', 'CERRAR', {duration: 4000});
            this.onShow.emit(false);
        });
    }

    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription$ = this._eventsServices.behaviorSubjectEvents$.subscribe(({isEdit, payload}) => {
            if (isEdit) {
                this.form.patchValue(payload);
            }
        });
    }

    /**
     * @description: Lista desplegable de contactos
     */
    private contacsList(): void {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Desmarcar seleccion',
            itemsShowLimit: 3,
            allowSearchFilter: true,
            searchPlaceholderText: 'Buscar contacto'
        };
    }

    /**
     * @description: Lista desplegable de contactos
     */

    private dataCotact(): void {
        const tmp = [];
        this.subscription$ = this._contacsService.getContacts().subscribe((data) => {
            for (let i = 0; i < data.data.length; i++) {
                tmp.push({item_id: i, item_text: data.data[i].full_name});
            }
            return this.dropdownList = tmp;
        });
    }

    /**
     * @description: Destruye las subscripciones
     */
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }
}
