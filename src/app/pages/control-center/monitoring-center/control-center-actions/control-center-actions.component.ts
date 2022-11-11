/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ControlCenterService } from 'app/core/services/control-center.service';
import { HistoriesService } from 'app/core/services/histories.service';
import { Subscription } from 'rxjs';
import { ModalContactsComponent } from '../modal-contacts/modal-contacts.component';
import { MapToolsService } from 'app/core/services/map-tools.service';
import moment from 'moment';

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
    public owner_id_simulator: number;
    public showPostponeAlarm: boolean = false;
    public attendedAlarmsForm: FormGroup;
    public selectedAlarm: any = [];
    public opened: boolean = true;
    public subscription: Subscription;
    public isAttended: boolean = true;
    public initialDate: Date = new Date();
    public finalDate: Date = new Date();
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
        public historicService: HistoriesService,
        public controlCenterService: ControlCenterService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private matDialog: MatDialog,
        private mapToolsService: MapToolsService
    ) {}

    ngOnInit(): void {
        this.mapToolsService.initMap();
        this.listenObservables();
        this.getAllCausalAttends();
        this.getAllStatusAttends();
        this.createContactForm();
        this.getReportAlarmsAttens();
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
                    if (!this.isAttended) {
                        this.mapToolsService.clearMap();
                        this.mapToolsService.setMarkers(
                            [this.selectedAlarm],
                            (this.mapToolsService.verCluster = false),
                            (this.mapToolsService.verLabel = true)
                        );
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
            dateInit:
                moment(this.initialDate).format('DD/MM/YYYY') + ' 00:00:00',
            dateEnd: moment(this.finalDate).format('DD/MM/YYYY') + ' 23:59:59',
        };
        console.log(data, 'data');

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
