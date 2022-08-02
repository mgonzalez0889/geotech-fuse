import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-fleet',
    templateUrl: './form-fleet.component.html',
    styleUrls: ['./form-fleet.component.scss'],
})
export class FormFleetComponent implements OnInit, OnDestroy {
    public fleetsPlateCount: number = 0;
    public fleetsPlate: any = [];
    public fleets: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public fleetForm: FormGroup;
    public subscription: Subscription;
    constructor(
        private fleetService: FleetsService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.createContactForm();
    }

    /**
     * @description: Valida si es edita o guarda una nueva flota
     */
    public onSave(): void {
        const data = this.fleetForm.getRawValue();
        if (!data.id) {
            this.newFleet(data);
        } else {
            this.editFleet(data);
        }
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        this.fleetService.behaviorSubjectFleetGrid.next({
            opened: false,
            reload: false,
        });
    }
    /**
     * @description: Elimina una flota
     */
    public deleteContact(id: number): void {
        let confirmation = this.confirmationService.open({
            title: 'Eliminar flota',
            message:
                '¿Está seguro de que desea eliminar esta flota? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.fleetService.deleteFleets(id).subscribe((res) => {
                    if (res.code === 200) {
                        this.fleetService.behaviorSubjectFleetGrid.next({
                            reload: true,
                            opened: false,
                        });
                        confirmation = this.confirmationService.open({
                            title: 'Eliminar flota',
                            message: 'Flota eliminada con exito!',
                            actions: {
                                cancel: {
                                    label: 'Aceptar',
                                },
                                confirm: {
                                    show: false,
                                },
                            },
                            icon: {
                                name: 'heroicons_outline:exclamation',
                                color: 'warn',
                            },
                        });
                    } else {
                        confirmation = this.confirmationService.open({
                            title: 'Eliminar flota',
                            message:
                                'La flota no pudo ser eliminada, favor intente nuevamente.',
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
     * @description: Inicializa el formulario de flotas
     */
    private createContactForm(): void {
        this.fleetForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required]],
            description: ['', [Validators.email, Validators.required]],
            mobiles: ['', [Validators.required]],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca la flota
     */
    private listenObservables(): void {
        this.subscription =
            this.fleetService.behaviorSubjectFleetForm.subscribe(
                ({ newFleet, payload, isEdit }) => {
                    console.log(newFleet, payload, isEdit, 'arturo');
                    this.editMode = isEdit;
                    if (newFleet) {
                        this.fleets = [];
                        this.fleets['name'] = newFleet;
                        if (this.fleetForm) {
                            this.fleetForm.reset();
                        }
                    }
                    if (payload.id) {
                        this.fleets = payload;
                        //this.fleetForm.patchValue(this.fleets);
                        this.fleetService
                            .getFleetsPlatesAssigned(payload.id)
                            .subscribe((res) => {
                                if (res.data) {
                                    this.fleetsPlateCount = res.data.length;
                                } else {
                                    this.fleetsPlateCount = 0;
                                }
                                this.fleetsPlate = res.data;
                                console.log(this.fleetsPlate['plate'], 'aaaaaaaaaaaaaaaa');
                            });
                    }
                }
            );
    }
    /**
     * @description: Editar una flota
     */
    private editFleet(data: any): void {
        let confirmation = this.confirmationService.open({
            title: 'Editar flota',
            message:
                '¿Está seguro de que desea editar esta flota? ¡Esta acción no se puede deshacer!',
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
                this.fleetService.putFleets(data).subscribe((res) => {
                    if (res.code === 200) {
                        this.fleetService.behaviorSubjectFleetGrid.next({
                            reload: true,
                            opened: false,
                        });
                        confirmation = this.confirmationService.open({
                            title: 'Editar flota',
                            message: 'Flota editada con exito!',
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
                            title: 'Editar flota',
                            message:
                                'La flota no se pudo actualizar, favor intente nuevamente.',
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
     * @description: Guarda una nuevo flota
     */
    private newFleet(data: any): void {
        this.fleetService.postFleets(data).subscribe((res) => {
            if (res.code === 200) {
                this.fleetService.behaviorSubjectFleetGrid.next({
                    reload: true,
                    opened: false,
                });
                const confirmation = this.confirmationService.open({
                    title: 'Crear una flota',
                    message: 'Flota creada con exito!',
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
                    title: 'Crear una flota',
                    message:
                        'La flota no pudo ser creada, favor intente nuevamente.',
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
