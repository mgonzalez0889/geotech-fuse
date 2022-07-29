/* eslint-disable @typescript-eslint/member-ordering */
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
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { Subscription, timer } from 'rxjs';
import { ModalContactsComponent } from '../modal-contacts/modal-contacts.component';

@Component({
    selector: 'app-control-center-actions',
    templateUrl: './control-center-actions.component.html',
    styleUrls: ['./control-center-actions.component.scss'],
})
export class ControlCenterActionsComponent implements OnInit, OnDestroy {
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
    public dataHisotiric: MatTableDataSource<any>;
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
    public columnsHisotiric: string[] = [
        'plate',
        'date_entry',
        'event',
        'address',
        'speed',
    ];
    @ViewChild(MatPaginator) paginatorHistoric: MatPaginator;
    @ViewChild(MatPaginator) paginatorContactsControlCenter: MatPaginator;
    @ViewChild(MatSort) sortHistoric: MatSort;
    @ViewChild(MatSort) sortContactsControlCenter: MatSort;
    constructor(
        public mapFunctionalitieService: MapFunctionalitieService,
        public historicService: HistoriesService,
        public controlCenterService: ControlCenterService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private paginatorIntl: MatPaginatorIntl,
        private matDialog: MatDialog
    ) {
        this.paginatorIntl.itemsPerPageLabel = 'Items por página:';
        this.paginatorIntl.firstPageLabel = 'Página anterior';
        this.paginatorIntl.previousPageLabel = 'Pagina anterior';
        this.paginatorIntl.nextPageLabel = 'Siguiente página';
        this.paginatorIntl.lastPageLabel = 'Última página';
    }

    ngOnInit(): void {
        this.listenObservables();
        this.getAllCausalAttends();
        this.getAllStatusAttends();
        this.createContactForm();
    }

    /**
     * @description:Genera el historico y eventos de las ultimas 24H del vehiculo seleccionado
     */
    private getHistoric(): void {
        const data = {
            plate: ['GB00133'],
            owner_event_id: [5, 2, 3],
            date: {
                dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
                dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
            },
        };
        // this.historicService.getHistoricPlate(data).subscribe((res) => {
        //     this.dataHisotiric = new MatTableDataSource(res.data);
        //     this.dataHisotiric.paginator = this.paginator;
        //     this.dataHisotiric.sort = this.sort;
        // });
    }
    /**
     * @description: Modal para agregar nuevo contacto
     */
    public newContact(): void {
        this.matDialog.open(ModalContactsComponent, {
            width: '485px',
        });
    }
    /**
     * @description: Pinta en el mapa el lugar donde fue la alarma
     */
    private getPointMap(data): void {
        this.mapFunctionalitieService.goDeleteGeometryPath();
        this.mapFunctionalitieService.createPunt(data, true);
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
            postponeAlarm: [''],
            causalAlarmAttend: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });
    }
    /**
     * @description: Atiende la alarma
     */
    public attendAlarm(): void {
        this.attendedAlarmsForm.patchValue({
            alarmAttendedId: this.selectedAlarm.id,
            causalName: this.selectedAlarm.event_name,
        });
        const data = this.attendedAlarmsForm.getRawValue();
        this.controlCenterService.postAttendAlarm(data).subscribe((res) => {
            if (res.code === 200) {
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
        });
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getContact(): void {
        console.log(this.selectedAlarm.owner_id, 'this.selectedAlarm.owner_id');
        this.dataTableContactsControlCenter = null;
        this.controlCenterService
            .getContactsControlCenter(this.selectedAlarm.owner_id)
            .subscribe((res) => {
                if (res.data) {
                    this.contactsCount = res.data.length;
                } else {
                    this.contactsCount = 0;
                }
                this.dataTableContactsControlCenter = new MatTableDataSource(
                    res.data
                );
                this.dataTableContactsControlCenter.paginator =
                    this.paginatorContactsControlCenter;
                this.dataTableContactsControlCenter.sort =
                    this.sortContactsControlCenter;
            });
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
            this.attendedAlarmsForm.controls['postponeAlarm'].setValidators(
                Validators.required
            );
            this.attendedAlarmsForm
                .get('postponeAlarm')
                .updateValueAndValidity();
        } else {
            this.showPostponeAlarm = false;

            this.attendedAlarmsForm.controls['postponeAlarm'].clearValidators();
            this.attendedAlarmsForm
                .get('postponeAlarm')
                .updateValueAndValidity();
        }
    }
    /**
     * @description: Funcion boton cancelar
     */
    public onCancel(): void {
        this.isAttended = false;
        this.loadMap();
        if (this.attendedAlarmsForm) {
            this.attendedAlarmsForm.reset();
        }
    }
    /**
     * @description: Para cargar el mapa
     */
    private loadMap(): void {
        this.mapFunctionalitieService.init();
        const time = timer(1000);
        time.subscribe((t) => {
            this.getPointMap(this.selectedAlarm);
        });
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
                    if (!this.isAttended) {
                        this.loadMap();
                    } else {
                        if (this.attendedAlarmsForm) {
                            this.attendedAlarmsForm.reset();
                        }
                        this.getContact();
                    }
                    console.log(payload, isAttended, 'payload');
                }
            );
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
