/* eslint-disable @typescript-eslint/member-ordering */
import {
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlCenterService } from 'app/core/services/control-center.service';
import { HistoriesService } from 'app/core/services/histories.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-control-center-actions',
    templateUrl: './control-center-actions.component.html',
    styleUrls: ['./control-center-actions.component.scss'],
})
export class ControlCenterActionsComponent
    implements OnInit, AfterViewInit, OnDestroy
{
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
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.getAllCausalAttends();
        this.getAllStatusAttends();
        this.createContactForm();
        this.getContact();
    }

    ngAfterViewInit(): void {}
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
     * @description:Genera los estado de atencion
     */
    private getAllStatusAttends(): void {
        this.controlCenterService.getAllStatusAttends().subscribe((res) => {
            this.statusAttends = res.data;
            console.log(res, 'estado de atencion');
        });
    }
    /**
     * @description:Genera las causales de la alarma
     */
    private getAllCausalAttends(): void {
        this.controlCenterService.getAllCausalAttends().subscribe((res) => {
            this.causalAttends = res.data;
            console.log(res, 'causal de atencion');
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
            postponeAlarm: ['', [Validators.required]],
            causalAlarmAttend: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });
    }
    /**
     * @description: Atiende la alarma
     */
    public attendAlarm(): void {
        console.log(this.selectedAlarm.event_id, this.selectedAlarm.event_name);
        this.attendedAlarmsForm.patchValue({
            alarmAttendedId: this.selectedAlarm.id,
            causalName: this.selectedAlarm.event_name,
        });
        const data = this.attendedAlarmsForm.getRawValue();
        this.controlCenterService.postAttendAlarm(data).subscribe((res) => {
            console.log(res, 'respuest');
        });
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getContact(): void {
        this.controlCenterService
            .getContactsControlCenter(this.selectedAlarm.owner_id)
            .subscribe((res) => {
                if (res.data) {
                    this.contactsCount = res.data.length;
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
