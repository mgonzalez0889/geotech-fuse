/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { MobileService } from 'app/core/services/mobile.service';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-fleet',
    templateUrl: './form-fleet.component.html',
    styleUrls: ['./form-fleet.component.scss'],
})
export class FormFleetComponent implements OnInit, OnDestroy {
    public owner_plate_id: any = [];
    public selection = new SelectionModel<any>(true, []);
    public mobilesCount: number = 0;
    public fleetsPlateCount: number = 0;
    public fleetsPlate: any = [];
    public fleets: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public fleetForm: FormGroup;
    public subscription: Subscription;
    public dataTableMobies: MatTableDataSource<any>;
    public columnsMobile: string[] = ['select', 'plate', 'internal_code'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private ownerPlateService: OwnerPlateService,
        private fleetService: FleetsService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private mobilesService: MobileService
    ) {}

    ngOnInit(): void {
        this.createContactForm();
        this.listenObservables();
    }

    /**
     * @description: Valida si es edita o guarda una nueva flota
     */
    public onSave(): void {
        this.owner_plate_id = [];
        this.selection.selected.forEach((x) => {
            this.owner_plate_id.push(x.id);
        });
        this.fleetForm.patchValue({ plates: this.owner_plate_id });
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
                this.fleetForm.disable();
                this.fleetService.deleteFleets(id).subscribe((res) => {
                    this.fleetForm.enable();
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
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableMobies.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Si el número de elementos seleccionados coincide con el número total de filas.
     */
    public isAllSelected(): any {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataTableMobies.data?.length;
        return numSelected === numRows;
    }
    /**
     * @description: Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección.
     */
    public toggleAllRows(): any {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataTableMobies.data);
    }
    /**
     * @description: Obtiene un listado de los vehiculos del cliente
     */
    public getMobiles(): void {
        this.ownerPlateService.getOwnerPlates().subscribe((res) => {
            this.selection.clear();
            if (res.data) {
                this.mobilesCount = res.data.length;
                res.data.forEach((row: any) => {
                    this.fleetsPlate?.forEach((x: any) => {
                        if (row.plate === x.plate) {
                            this.selection.select(row);
                        }
                    });
                });
            } else {
                this.mobilesCount = 0;
            }
            this.dataTableMobies = new MatTableDataSource(res.data);
            this.dataTableMobies.paginator = this.paginator;
            this.dataTableMobies.sort = this.sort;
        });
    }
    /**
     * @description: Inicializa el formulario de flotas
     */
    private createContactForm(): void {
        this.fleetForm = this.fb.group({
            id: [''],
            name: ['', [Validators.required]],
            description: [''],
            plates: [''],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca la flota
     */
    private listenObservables(): void {
        this.subscription =
            this.fleetService.behaviorSubjectFleetForm.subscribe(
                ({ newFleet, payload, isEdit }) => {
                    this.editMode = isEdit;
                    if (newFleet) {
                        this.fleetsPlate = null;
                        this.fleets = [];
                        this.fleets['name'] = newFleet;
                        if (this.fleetForm) {
                            this.fleetForm.reset();
                        }
                    }
                    if (payload?.id) {
                        this.fleets = payload;
                        this.fleetForm.patchValue(this.fleets);
                        this.fleetService
                            .getFleetsPlatesAssigned(payload.id)
                            .subscribe((res) => {
                                this.fleetsPlate = res.data;
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
            this.fleetForm.disable();
            if (result === 'confirmed') {
                this.fleetService.putFleets(data).subscribe((res) => {
                    this.fleetForm.enable();
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
        this.fleetForm.disable();
        this.fleetService.postFleets(data).subscribe((res) => {
            this.fleetForm.enable();
            if (res.code === 200) {
                this.fleetService.behaviorSubjectFleetGrid.next({
                    reload: true,
                    opened: false,
                });
                this.confirmationService.open({
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
                this.confirmationService.open({
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
