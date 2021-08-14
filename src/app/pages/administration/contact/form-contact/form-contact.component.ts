import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "../../../../core/services/contact.service";
import {ActivatedRoute, Router} from "@angular/router";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-form-contact',
    templateUrl: './form-contact.component.html',
    styleUrls: ['./form-contact.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FormContactComponent implements OnInit, OnDestroy {

    public formContacts: FormGroup;
    public subscription$: Subscription;
    public titleForm: string;


    id: string;
    @Output() onShow: EventEmitter<boolean> = new EventEmitter<boolean>();


    constructor(
        private fb: FormBuilder,
        private _contactService: ContactService,
        private router: Router,
        private aRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
    ) {
    }

    ngOnInit(): void {
        this.createContactForm();
        this.listenObservables();

    }

    /**
     * @description: Crear o editar un nuevo contacto
     */
    public onSave(): void {
        const data = this.formContacts.getRawValue();
        if (!data.id) {
            this.newContact(data);
            //alert('ola papu');
        } else {
            this.editContact(data);
            //alert(data.id);
        }
    }

    /**
     * @description: Cierra formulario
     */
    public onClose(): void {
        this.onShow.emit(false);
    }

    /***
     * @description: Creacion de los datos del formulario de contactos
     */
    private createContactForm(): void {
        this.formContacts = this.fb.group({
                id: undefined,
                full_name: ['',[Validators.required]],
                identification: ['',[Validators.required]],
                email: ['', [Validators.email]],
                phone: ['',[Validators.required]],
                address: ['',[Validators.required]]
            }
        );
    }

    /**
     * @description: Crear un nuevo contacto
     */
    private newContact(data: any): void {
        this.subscription$ = this._contactService.postContacts(data).subscribe((res) => {
            this._snackBar.open('Se ha creado el nuevo contacto', 'CERRAR', {duration: 4000});
            this.onShow.emit(false);
        });
    }

    /**
     * @description: Editar contacto
     */
    private editContact(data: any): void {
        this.subscription$ = this._contactService.putContacts(data).subscribe((res) => {
                this._snackBar.open('Contacto actualizado con exito', 'CERRAR', {duration: 4000});
                this.onShow.emit(false);
            }
        );
    }

    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription$ = this._contactService.behaviorSubjectContact$.subscribe(({type, isEdit, payload}) => {
            if (isEdit && type == 'EDIT') {
                this.formContacts.patchValue(payload);
                this.titleForm = 'Editar contacto';
            } else if (!isEdit && type == 'NEW') {
                this.formContacts.reset({
                });
                this.titleForm = 'Nuevo contacto';

            }
        });
    }

    /**
     * @description: Destruye las subscripciones
     */
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }

}
