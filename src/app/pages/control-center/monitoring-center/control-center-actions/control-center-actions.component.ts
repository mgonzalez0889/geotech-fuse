/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ControlCenterService } from 'app/core/services/control-center.service';
import { HistoriesService } from 'app/core/services/histories.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { Subscription, timer } from 'rxjs';
import { ModalContactsComponent } from '../modal-contacts/modal-contacts.component';

@Component({
    selector: 'app-control-center-actions',
    templateUrl: './control-center-actions.component.html',
    styleUrls: ['./control-center-actions.component.scss'],
})
export class ControlCenterActionsComponent implements OnInit, OnDestroy {
    @ViewChild('paginatorContactsControlCenter')
    paginatorContactsControlCenter: MatPaginator;
    @ViewChild('sortContactsControlCenter') sortContactsControlCenter: MatSort;
    @ViewChild('paginatorAttendedAlarms')
    paginatorAttendedAlarms: MatPaginator;
    @ViewChild('sortAttendedAlarms') sortAttendedAlarms: MatSort;
    public map: L.Map;
    public markersPoint = {};
    public owner_id_simulator: number;
    public minDate = new Date();
    public showPostponeAlarm: boolean = false;
    public attendedAlarmsForm: FormGroup;
    public selectedAlarm: any = [];
    public opened: boolean = true;
    public subscription: Subscription;
    public isAttended: boolean = true;
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    public dataTableAttendedAlarms: MatTableDataSource<any>;
    public statusAttends = [];
    public causalAttends = [];
    public dataTableContactsControlCenter: MatTableDataSource<any>;
    public contactsCount: number = 0;
    public columnsContactsControlCenter: string[] = [
        'name',
        'identification',
        'cellPhone',
        'type_contacs',
        'email',
        'description',
        'actions',
    ];
    public columnsAttendedAlarms: string[] = [
        'plate',
        'alarm',
        'date_entry_alarm',
        'date_init_alarm',
        'reaction_time',
        'date_end_alarm',
        'time_attention',
        'user',
        'action',
    ];

    constructor(
        public mapFunctionalitieService: MapFunctionalitieService,
        public historicService: HistoriesService,
        public controlCenterService: ControlCenterService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.getAllCausalAttends();
        this.getAllStatusAttends();
        this.createContactForm();
        this.getReportAlarmsAttens();
        this.loadMap();
    }
    /**
     * @description: Modal para agregar nuevo contacto
     */
    public newContact(): void {
        const dialogRef = this.matDialog.open(ModalContactsComponent, {
            width: '455px',
            data: {
                owner_id: this.selectedAlarm.owner_id,
                owner_id_simulator: this.owner_id_simulator,
            },
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                setTimeout(() => {
                    this.getContact();
                }, 6000);
            }
        });
    }
    /**
     * @description: Modal para editar un contacto
     */
    public editContact(id: number): void {
        const dialogRef = this.matDialog.open(ModalContactsComponent, {
            width: '455px',
            data: {
                id: id,
                owner_id_simulator: this.owner_id_simulator,
            },
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (res) {
                this.getContact();
            }
        });
    }
    /**
     * @description: Pinta en el mapa el lugar donde fue la alarma
     */
    private getPointMap(data): void {
        for (const point in this.markersPoint) {
            this.map.removeLayer(this.markersPoint[point]);
        }
        const myIconUrl =
            'data:image/svg+xml,' +
            encodeURIComponent(
                '<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19C5.73693 17.9227 4.56619 16.7416 3.5 15.4691C1.9 13.5581 8.83662e-07 10.712 8.83662e-07 8.00005C-0.00141728 5.1676 1.70425 2.61344 4.32107 1.52945C6.93789 0.445455 9.95007 1.04529 11.952 3.04905C13.2685 4.35966 14.0059 6.14244 14 8.00005C14 10.712 12.1 13.5581 10.5 15.4691C9.43382 16.7416 8.26307 17.9227 7 19ZM7 5.00005C5.92821 5.00005 4.93782 5.57185 4.40193 6.50005C3.86603 7.42825 3.86603 8.57185 4.40193 9.50005C4.93782 10.4283 5.92821 11.0001 7 11.0001C8.65686 11.0001 10 9.6569 10 8.00005C10 6.3432 8.65686 5.00005 7 5.00005Z" fill="' +
                    data.color_event +
                    '"/></svg>'
            );
        const x = data.x;
        const y = data.y;
        this.map.setView([x, y]);
        this.markersPoint[data.id] = L.marker([x, y], {
            icon: L.icon({
                iconUrl: myIconUrl,
                iconSize: [36, 40],
                iconAnchor: [18, 40],
            }),
        });
        this.markersPoint[data.id].addTo(this.map);
    }
    /**
     * @description:Genera los estado de atencion
     */
    private getAllStatusAttends(): void {
        this.controlCenterService.getAllStatusAttends().subscribe((res) => {
            this.statusAttends = res.data;
        });
    }
    /**
     * @description:Genera las causales de la alarma
     */
    private getAllCausalAttends(): void {
        this.controlCenterService.getAllCausalAttends().subscribe((res) => {
            this.causalAttends = res.data;
        });
    }
    /**
     * @description: Inicializa el formulario
     */
    private createContactForm(): void {
        this.attendedAlarmsForm = this.fb.group({
            alarmAttendedId: [''],
            causalName: [''],
            stateAlarmAttend: ['', [Validators.required]],
            postponeAlarmDate: [''],
            wait_alarm: [''],
            postponeAlarmHour: [''],
            causalAlarmAttend: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });
    }
    /**
     * @description: Atiende la alarma
     */
    public attendAlarms(): void {
        let postponeAlarm = null;
        if (this.attendedAlarmsForm.get('postponeAlarmDate').value) {
            postponeAlarm =
                this.attendedAlarmsForm
                    .get('postponeAlarmDate')
                    .value?.toLocaleDateString() +
                ' ' +
                this.attendedAlarmsForm.get('postponeAlarmHour').value;
        } else {
            postponeAlarm = null;
        }
        this.attendedAlarmsForm.patchValue({
            alarmAttendedId: [this.selectedAlarm.id],
            causalName: this.selectedAlarm.event_name,
            wait_alarm: postponeAlarm,
        });
        const data = this.attendedAlarmsForm.getRawValue();
        if (this.owner_id_simulator === 1) {
            this.controlCenterService.postAttendAlarm(data).subscribe((res) => {
                this.attendAlarm(res);
            });
        } else {
            this.controlCenterService
                .postAttendAlarmOwner(data)
                .subscribe((res) => {
                    this.attendAlarm(res);
                });
        }
    }
    private attendAlarm(data: any): void {
        if (data.code === 200) {
            this.controlCenterService.behaviorSubjectContactGrid.next({
                opened: false,
                reload: true,
            });
            this.confirmationService.open({
                title: 'Atención de alarma',
                message: 'Alarma atendida con exito!',
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
                title: 'Atención de alarma',
                message:
                    'La alarma no se pudo atender, favor intente nuevamente.',
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
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getContact(): void {
        this.dataTableContactsControlCenter = null;
        if (this.owner_id_simulator === 1) {
            this.controlCenterService
                .getContactsControlCenter(this.selectedAlarm.owner_id)
                .subscribe((res) => {
                    if (res.data) {
                        this.contactsCount = res.data.length;
                    } else {
                        this.contactsCount = 0;
                    }
                    this.dataTableContactsControlCenter =
                        new MatTableDataSource(res.data);
                    this.dataTableContactsControlCenter.paginator =
                        this.paginatorContactsControlCenter;
                    this.dataTableContactsControlCenter.sort =
                        this.sortContactsControlCenter;
                });
        } else {
            this.controlCenterService
                .getContactsControlCenterOwner(this.selectedAlarm.owner_id)
                .subscribe((res) => {
                    if (res.data) {
                        this.contactsCount = res.data.length;
                    } else {
                        this.contactsCount = 0;
                    }
                    this.dataTableContactsControlCenter =
                        new MatTableDataSource(res.data);
                    this.dataTableContactsControlCenter.paginator =
                        this.paginatorContactsControlCenter;
                    this.dataTableContactsControlCenter.sort =
                        this.sortContactsControlCenter;
                });
        }
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        if (this.attendedAlarmsForm) {
            this.attendedAlarmsForm.reset();
        }
        this.controlCenterService.behaviorSubjectContactGrid.next({
            opened: false,
            reload: false,
        });
    }
    /**
     * @description: Valida si se va a posponer la alarma
     */
    public validStateAlarmAttend(idEvent: number): void {
        if (idEvent === 6) {
            this.showPostponeAlarm = true;
            this.attendedAlarmsForm.controls['postponeAlarmDate'].setValidators(
                Validators.required
            );
            this.attendedAlarmsForm.controls['postponeAlarmHour'].setValidators(
                Validators.required
            );
            this.attendedAlarmsForm
                .get('postponeAlarmDate')
                .updateValueAndValidity();
            this.attendedAlarmsForm
                .get('postponeAlarmHour')
                .updateValueAndValidity();
        } else {
            this.showPostponeAlarm = false;
            this.attendedAlarmsForm.controls['postponeAlarmDate'].setValue(
                null
            );
            this.attendedAlarmsForm.controls['postponeAlarmHour'].setValue(
                null
            );
            this.attendedAlarmsForm.controls[
                'postponeAlarmDate'
            ].clearValidators();
            this.attendedAlarmsForm.controls[
                'postponeAlarmHour'
            ].clearValidators();
            this.attendedAlarmsForm
                .get('postponeAlarmDate')
                .updateValueAndValidity();
            this.attendedAlarmsForm
                .get('postponeAlarmHour')
                .updateValueAndValidity();
        }
    }
    /**
     * @description: Funcion boton cancelar
     */
    public onCancel(): void {
        this.isAttended = false;
        if (this.attendedAlarmsForm) {
            this.attendedAlarmsForm.reset();
        }
    }
    /**
     * @description: Elimina el contacto
     */
    public deleteContacts(id: number): void {
        const confirmation = this.confirmationService.open({
            title: 'Eliminar contacto',
            message:
                '¿Está seguro de que desea eliminar este contacto? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                if (this.owner_id_simulator === 1) {
                    this.controlCenterService
                        .deleteContacts(id)
                        .subscribe((res) => {
                            this.deleteContact(res);
                        });
                } else {
                    this.controlCenterService
                        .deleteContactsOwner(id)
                        .subscribe((res) => {
                            this.deleteContact(res);
                        });
                }
            }
        });
    }
    private deleteContact(data: any): void {
        if (data.code === 200) {
            this.getContact();
            this.confirmationService.open({
                title: 'Eliminar contacto',
                message: 'Contacto eliminado con exito!',
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
            this.confirmationService.open({
                title: 'Eliminar contacto',
                message:
                    'El contacto no se pudo eliminar, favor intente nuevamente.',
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
    }
    /**
     * @description: Para cargar el mapa
     */
    private loadMap(): void {
        const GoogleMaps = L.tileLayer(
            'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
            {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            }
        );
        const GoogleHybrid = L.tileLayer(
            'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
            {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            }
        );
        this.map = L.map('map', {
            fullscreenControl: true,
            center: [11.004313, -74.808137],
            zoom: 10,
            layers: [GoogleMaps],
            attributionControl: false,
        });
        const baseLayers = {
            'Google Maps': GoogleMaps,
            'Google Hibrido': GoogleHybrid,
        };
        L.control.layers(baseLayers).addTo(this.map);
        this.getPointMap(this.selectedAlarm);
    }
    /**
     * @description: Escucha el observable behavior y busca al contacto
     */
    private listenObservables(): void {
        this.subscription =
            this.controlCenterService.behaviorSubjectContactForm.subscribe(
                ({ payload, isAttended }) => {
                    this.selectedAlarm = payload;
                    this.isAttended = isAttended;
                    this.owner_id_simulator =
                        this.selectedAlarm['owner_id_simulator'];
                    // this.owner_id_simulator = this.isAttended.owner_id_simulator
                    if (!this.isAttended) {
                        const time = timer(1000);
                        time.subscribe((t) => {
                            this.getPointMap(this.selectedAlarm);
                        });
                        this.getReportAlarmsAttens();
                    } else {
                        if (this.attendedAlarmsForm) {
                            this.attendedAlarmsForm.reset();
                        }
                        this.getContact();
                    }
                }
            );
    }
    public getReportAlarmsAttens(): void {
        const data = {
            plate: this.selectedAlarm.plate,
            dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
            dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
        };
        if (this.owner_id_simulator === 1) {
            this.controlCenterService
                .postReportAlarmsAttens(data)
                .subscribe((res) => {
                    this.dataTableAttendedAlarms = new MatTableDataSource(
                        res.data
                    );
                    this.dataTableAttendedAlarms.paginator =
                        this.paginatorAttendedAlarms;
                    this.dataTableAttendedAlarms.sort = this.sortAttendedAlarms;
                });
        } else {
            //Centro de control de los clientes
            this.controlCenterService
                .postReportAlarmsAttensOwner(data)
                .subscribe((res) => {
                    this.dataTableAttendedAlarms = new MatTableDataSource(
                        res.data
                    );
                    this.dataTableAttendedAlarms.paginator =
                        this.paginatorAttendedAlarms;
                    this.dataTableAttendedAlarms.sort = this.sortAttendedAlarms;
                });
        }
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
