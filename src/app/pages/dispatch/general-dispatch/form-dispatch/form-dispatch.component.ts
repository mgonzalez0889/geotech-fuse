/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { DispathService } from 'app/core/services/dispath.service';
import { StartDispatchComponent } from 'app/shared/dialogs/start-dispatch/start-dispatch.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-dispatch',
    templateUrl: './form-dispatch.component.html',
    styleUrls: ['./form-dispatch.component.scss'],
})
export class FormDispatchComponent implements OnInit, OnDestroy {
    public dispaths: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public dispathForm: FormGroup;
    public subscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private dispathService: DispathService,
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
        const data = this.dispathForm.getRawValue();
        if (!data.id) {
            this.newDispath(data);
        } else {
            this.editDispath(data);
        }
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        this.dispathService.behaviorSubjectDispathGrid.next({
            opened: false,
            reload: false,
        });
    }
    /**
     * @description: Modal para agregar nuevo contacto
     */
    public startDispatch(): void {
        const dialogRef = this.matDialog.open(StartDispatchComponent, {
            width: '455px',
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
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
        this.dispathForm = this.fb.group({
            id: [''],
            spreadsheet: ['', [Validators.required]],
            owner_name: ['', [Validators.required]],
            source: ['', [Validators.required]],
            destiny: ['', [Validators.required]],
            plate: ['', [Validators.required]],
            container_number: ['', [Validators.required]],
            driver_name: ['', [Validators.required]],
            identification_driver: ['', [Validators.required]],
            driver_contact: ['', [Validators.required]],
            details: [''],
            security_seal: ['', [Validators.required]],
            device: ['', [Validators.required]],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca al despacho
     */
    private listenObservables(): void {
        this.subscription =
            this.dispathService.behaviorSubjectDispathForm.subscribe(
                ({ newDispath, id, isEdit }) => {
                    // this.editMode = isEdit;
                    if (newDispath) {
                        this.dispaths = [];
                        this.dispaths['owner_name'] = newDispath;
                        if (this.dispathForm) {
                            this.dispathForm.reset();
                        }
                    }
                    if (id) {
                        this.dispathService.getDispath(id).subscribe((res) => {
                            this.dispaths = res.data;
                            this.dispathForm.patchValue(this.dispaths);
                        });
                    }
                }
            );
    }
    /**
     * @description: Editar un despacho
     */
    private editDispath(data: any): void {
        this.dispathForm.disable();
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
                this.dispathService.putDispath(data).subscribe((res) => {
                    this.dispathForm.enable();
                    if (res.code === 200) {
                        this.dispathService.behaviorSubjectDispathGrid.next({
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
    private newDispath(data: any): void {
        this.dispathForm.disable();
        this.dispathService.postDispath(data).subscribe((res) => {
            this.dispathForm.enable();
            if (res.code === 200) {
                this.dispathService.behaviorSubjectDispathGrid.next({
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
