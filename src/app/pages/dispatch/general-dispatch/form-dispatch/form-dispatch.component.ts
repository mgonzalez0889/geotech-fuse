/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { DispatchService } from 'app/core/services/dispatch.service';
import { StartDispatchComponent } from 'app/pages/dispatch/general-dispatch/start-dispatch/start-dispatch.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-dispatch',
    templateUrl: './form-dispatch.component.html',
    styleUrls: ['./form-dispatch.component.scss'],
})
export class FormDispatchComponent implements OnInit, OnDestroy {
    public dispatches: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public dispatchForm: FormGroup;
    public subscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private dispatchService: DispatchService,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.createContactForm();
    }
    /**
     * @description: Valida si es edita o guarda un despacho nuevo
     */
    public onSave(): void {
        const data = this.dispatchForm.getRawValue();
        if (!data.id) {
            this.newDispatch(data);
        } else {
            this.editDispatch(data);
        }
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        this.dispatchService.behaviorSubjectDispatchGrid.next({
            opened: false,
            reload: false,
        });
    }
    /**
     * @description: Modal para asignar un dispositivo al despacho
     */
    public startDispatch(): void {
        const dialogRef = this.matDialog.open(StartDispatchComponent, {
            width: '455px',
            data: this.dispatches,
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
            }
        });
    }
    /**
     * @description: Finaliza un despacho
     */
    public finishDispatch(): void {
        const data = {
            id: this.dispatches['id'],
            date_end_dispatch: new Date(),
        };
        let confirmation = this.confirmationService.open({
            title: 'Finalizar despacho',
            message:
                '¿Está seguro de que desea finalizar este despacho? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Finalizar',
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
                this.dispatchService.putDispatch(data).subscribe((res) => {
                    if (res.code === 200) {
                        this.dispatchService.behaviorSubjectDispatchGrid.next({
                            reload: true,
                            opened: false,
                        });
                        confirmation = this.confirmationService.open({
                            title: 'Finalizar despacho',
                            message: 'Despacho finalizado con exito!',
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
                            title: 'Finalizar despacho',
                            message:
                                'El despacho no se pudo finalizar, favor intente nuevamente.',
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
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    /**
     * @description: Inicializa el formulario de despachos
     */
    private createContactForm(): void {
        this.dispatchForm = this.fb.group({
            id: [''],
            spreadsheet: ['', [Validators.required]],
            client: ['', [Validators.required]],
            init_place: ['', [Validators.required]],
            end_place: ['', [Validators.required]],
            plate: ['', [Validators.required]],
            container_number: ['', [Validators.required]],
            owner_driver_name: ['', [Validators.required]],
            identification_driver: ['', [Validators.required]],
            driver_contact: ['', [Validators.required]],
            detail: [''],
            security_seal: [{ value: '', disabled: true }],
            device: [{ value: '', disabled: true }],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca al despacho
     */
    private listenObservables(): void {
        this.subscription =
            this.dispatchService.behaviorSubjectDispatchForm.subscribe(
                ({ newDispatch, id, isEdit }) => {
                    this.editMode = isEdit;
                    if (newDispatch) {
                        this.dispatches = [];
                        this.dispatches['client'] = newDispatch;
                        if (this.dispatchForm) {
                            this.dispatchForm.reset();
                        }
                    }
                    if (id) {
                        this.dispatchService
                            .getDispatch(id)
                            .subscribe((res) => {
                                this.dispatches = res.data;
                                this.dispatchForm.patchValue(this.dispatches);
                            });
                    }
                }
            );
    }
    /**
     * @description: Editar un despacho
     */
    private editDispatch(data: any): void {
        this.dispatchForm.disable();
        let confirmation = this.confirmationService.open({
            title: 'Editar despacho',
            message:
                '¿Está seguro de que desea editar este despacho? ¡Esta acción no se puede deshacer!',
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
                this.dispatchService.putDispatch(data).subscribe((res) => {
                    this.dispatchForm.enable();
                    if (res.code === 200) {
                        this.dispatchService.behaviorSubjectDispatchGrid.next({
                            reload: true,
                            opened: false,
                        });
                        confirmation = this.confirmationService.open({
                            title: 'Editar despacho',
                            message: 'Despacho editado con exito!',
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
                            title: 'Editar despacho',
                            message:
                                'El despacho no se pudo actualizar, favor intente nuevamente.',
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
    private newDispatch(data: any): void {
        this.dispatchForm.disable();
        this.dispatchService.postDispatch(data).subscribe((res) => {
            this.dispatchForm.enable();
            if (res.code === 200) {
                this.dispatchService.behaviorSubjectDispatchGrid.next({
                    reload: true,
                    opened: false,
                });
                const confirmation = this.confirmationService.open({
                    title: 'Crear despacho',
                    message: 'Despacho creado con exito!',
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
                    title: 'Crear despacho',
                    message:
                        'El despacho no se pudo crear, favor intente nuevamente.',
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
