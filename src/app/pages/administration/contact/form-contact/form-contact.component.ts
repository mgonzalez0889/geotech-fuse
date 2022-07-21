import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactService } from 'app/core/services/contact.service';

@Component({
    selector: 'app-form-contact',
    templateUrl: './form-contact.component.html',
    styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent implements OnInit {
    public contacts: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public contactForm: FormGroup;
    constructor(
        private contactService: ContactService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.createContactForm();
    }
    public onSave(): void {
        const data = this.contactForm.getRawValue();
        if (!data.id) {
            this.newContact(data);
        } else {
            this.editContact(data);
        }
    }
    public closeMenu(): void {
        this.contactService.behaviorSubjectContactActions$.next({
            reload: false,
            opened: false,
        });
    }

    /**
     * @description: Eliminar contacto
     */
    public deleteContact(id: number): void {
        this.contactService.deleteContacts(id).subscribe((data) => {
            if (data.code === 200) {
                this.contactService.behaviorSubjectContactActions$.next({
                    reload: true,
                    opened: false,
                });
                this.snackBar.open('Contacto eliminiado con exito.', 'CERRAR', {
                    duration: 4000,
                });
            } else {
                this.snackBar.open(
                    'El contacto no se pudo elimnar, favor intente nuevamente.',
                    'CERRAR',
                    {
                        duration: 4000,
                    }
                );
            }
        });
    }
    /**
     * @description: Creacion de los datos del formulario de contactos
     */
    private createContactForm(): void {
        this.contactForm = this.fb.group({
            id: [''],
            full_name: ['', [Validators.required]],
            email: ['', [Validators.email, Validators.required]],
            phone: ['', [Validators.required]],
            identification: ['', [Validators.required]],
            address: ['', [Validators.required]],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca al contacto
     */
    private listenObservables(): void {
        this.contactService.behaviorSubjectContactId$.subscribe(
            ({ id, newContact }) => {
                console.log(newContact, 'newContact');
                this.editMode = newContact;
                this.contactService.getContact(id).subscribe((data) => {
                    this.contacts = data.data;
                    this.contactForm.patchValue(this.contacts);
                });
            }
        );
    }
    /**
     * @description: Editar un contacto
     */
    private editContact(data: any): void {
        this.contactService.putContacts(data).subscribe((res) => {
            this.contactService.behaviorSubjectContactActions$.next({
                reload: true,
                opened: true,
            });
            if (res.code === 200) {
                this.editMode = false;
                this.listenObservables();
                this.snackBar.open('Contacto actualizado con exito', 'CERRAR', {
                    duration: 4000,
                });
            } else {
                this.snackBar.open(
                    'El contacto no se pudo actualizar, favor intente nuevamente.',
                    'CERRAR',
                    {
                        duration: 4000,
                    }
                );
            }
        });
    }

    private newContact(data: any): void {
        this.contactService.postContacts(data).subscribe((res) => {
            if (res.code === 200) {
                this.editMode = false;
                this.listenObservables();
                this.snackBar.open('Contacto creado con exito', 'CERRAR', {
                    duration: 4000,
                });
            } else {
                this.snackBar.open(
                    'El contacto no se pudo crear, favor intente nuevamente.',
                    'CERRAR',
                    {
                        duration: 4000,
                    }
                );
            }
        });
    }
}
