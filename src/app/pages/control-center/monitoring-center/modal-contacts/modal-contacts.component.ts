import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ControlCenterService } from 'app/core/services/control-center.service';

@Component({
    selector: 'app-modal-contacts',
    templateUrl: './modal-contacts.component.html',
    styleUrls: ['./modal-contacts.component.scss'],
})
export class ModalContactsComponent implements OnInit {
    public contactForm: FormGroup;
    public typeContacts: any = [];

    constructor(
        private controlCenterService: ControlCenterService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.createContactForm();
        this.typeContact();
    }
    /**
     * @description: Valida si es edita o guarda un contacto nuevo
     */
    public onSave(): void {
        const data = this.contactForm.getRawValue();
        if (!data.id) {
            this.newContact(data);
        } else {
            this.editContact(data);
        }
    }

    /**
     * @description: Trae los tipos de contacto
     */
    private typeContact(): void {
        this.controlCenterService
            .getTypeContactsControlCenter()
            .subscribe((res) => {
                this.typeContacts = res.data;
            });
    }
    /**
     * @description: Inicializa el formulario de contactos
     */
    private createContactForm(): void {
        this.contactForm = this.fb.group({
            id: [''],
            owner_id: [''],
            type_contact_id: [1, [Validators.required]],
            full_name: ['', [Validators.required]],
            email: ['', [Validators.email, Validators.required]],
            phone: ['', [Validators.required]],
            identification: ['', [Validators.required]],
            address: ['', [Validators.required]],
            description: [''],
        });
    }
    /**
     * @description: Editar un contacto
     */
    private editContact(data: any): void {
        let confirmation = this.confirmationService.open({
            title: 'Editar contacto',
            message:
                '¿Está seguro de que desea editar este contacto? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Editar',
                    color: 'accent',
                },
            },
            icon: {
                name: 'heroicons_outline:pencil',
                color: 'info',
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.controlCenterService.putContacts(data).subscribe((res) => {
                    if (res.code === 200) {
                        this.controlCenterService.behaviorSubjectContactGrid.next(
                            {
                                reload: true,
                                opened: false,
                            }
                        );
                        confirmation = this.confirmationService.open({
                            title: 'Editar contacto',
                            message: 'Contacto editado con exito!',
                            actions: {
                                cancel: {
                                    label: 'Aceptar',
                                },
                                confirm: {
                                    show: false,
                                },
                            },
                            icon: {
                                name: 'heroicons_outline:check-circle',
                                color: 'success',
                            },
                        });
                    } else {
                        confirmation = this.confirmationService.open({
                            title: 'Editar contacto',
                            message:
                                'El contacto no se pudo actualizar, favor intente nuevamente.',
                            actions: {
                                cancel: {
                                    label: 'Aceptar',
                                },
                                confirm: {
                                    show: false,
                                },
                            },
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warn',
                            },
                        });
                    }
                });
            }
        });
    }
    /**
     * @description: Guarda un nuevo contacto
     */
    private newContact(data: any): void {
        this.controlCenterService.postContacts(data).subscribe((res) => {
            if (res.code === 200) {
                this.controlCenterService.behaviorSubjectContactGrid.next({
                    reload: true,
                    opened: false,
                });
                const confirmation = this.confirmationService.open({
                    title: 'Crear contacto',
                    message: 'Contacto creado con exito!',
                    actions: {
                        cancel: {
                            label: 'Aceptar',
                        },
                        confirm: {
                            show: false,
                        },
                    },
                    icon: {
                        name: 'heroicons_outline:check-circle',
                        color: 'success',
                    },
                });
            } else {
                const confirmation = this.confirmationService.open({
                    title: 'Crear contacto',
                    message:
                        'El contacto no se pudo crear, favor intente nuevamente.',
                    actions: {
                        cancel: {
                            label: 'Aceptar',
                        },
                        confirm: {
                            show: false,
                        },
                    },
                    icon: {
                        show: true,
                        name: 'heroicons_outline:exclamation',
                        color: 'warn',
                    },
                });
            }
        });
    }
}
