/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlCenterService } from 'app/core/services/control-center.service';
import { UsersService } from 'app/core/services/users.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-control-center-dashboard',
    templateUrl: './control-center-dashboard.component.html',
    styleUrls: ['./control-center-dashboard.component.scss'],
})
export class ControlCenterDashboardComponent implements OnInit, OnDestroy {
    public owner_id_simulator: number;
    public alarms: any = [];
    public subscription: Subscription;
    public filterAlarms: number = 0;
    public notAttended: number = 0;
    public silenced: number = 0;
    public onTrack: number = 0;
    public inRecovery: number = 0;
    public dataAlarmSelect = [];
    public opened: boolean = false;
    public dataAlarms: MatTableDataSource<any>;
    public selection = new SelectionModel<any>(true, []);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public columnsAlarms: string[] = [
        'event_name',
        'state',
        'plate',
        'code',
        'count',
        'address',
        'date_entry',
    ];

    constructor(
        private controlCenterService: ControlCenterService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.getInfoUser();
        this.listenObservables();
    }
    /**
     * @description: Trae la informacion del usuario
     */
    public getInfoUser(): void {
        this.usersService.getInfoUser().subscribe((res) => {
            this.owner_id_simulator = res.data.owner_id_simulator;
            this.getAllAlarms();
        });
    }
    /**
     * @description Si el número de elementos seleccionados coincide con el número total de filas.
     */
    public isAllSelected(): any {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataAlarms?.data.length;
        return numSelected === numRows;
    }

    /**
     * @description  Selects all rows if they are not all selected; otherwise clear selection.
     */
    public toggleAllRows(): void {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }
        this.selection.select(...this.dataAlarms.data);
    }
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
            row.position + 1
        }`;
    }
    /**
     * @description: Trae tolas las alarmas
     */
    private getAllAlarms(): void {
        //Centro de control de geotech (ve todas las alarmas)
        if (this.owner_id_simulator === 1) {
            this.controlCenterService
                .getAllAlarms(this.filterAlarms)
                .subscribe((res) => {
                    this.getAlarms(res);
                });
        } else {
            //Centro de control de los clientes
            this.controlCenterService
                .getAllAlarmsOwner(this.filterAlarms)
                .subscribe((res) => {
                    this.getAlarms(res);
                });
        }
    }

    private getAlarms(data: any): void {
        if (data.count_status_alarms) {
            this.notAttended = data.count_status_alarms[0]?.count_state;
            this.silenced = data.count_status_alarms[1]?.count_state;
            this.onTrack = data.count_status_alarms[2]?.count_state;
            this.inRecovery = data.count_status_alarms[3]?.count_state;
        } else {
            this.notAttended = 0;
            this.silenced = 0;
            this.onTrack = 0;
            this.inRecovery = 0;
        }
        this.alarms = data.data;
        this.dataAlarms = new MatTableDataSource(data.data);
        this.dataAlarms.paginator = this.paginator;
        this.dataAlarms.sort = this.sort;
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription =
            this.controlCenterService.behaviorSubjectContactGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getAllAlarms();
                    }
                }
            );
    }
    public changeTab(index: number): void {
        this.filterAlarms = index;
        this.getAllAlarms();
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataAlarms.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda la data de la alarma para aburir el formulario
     */
    public actionsControlCenter(data: any): void {
        this.controlCenterService.getInitAttention(data.id).subscribe((res) => {
            if (res.code === 200) {
                this.getAllAlarms();
            }
        });
        this.opened = true;
        this.dataAlarmSelect = data;
        this.controlCenterService.behaviorSubjectContactForm.next({
            payload: this.dataAlarmSelect,
            isAttended: false,
        });
    }
    /**
     * @description: Abre modal para atender alarma
     */
    public attendAlarm(): void {
        this.controlCenterService.behaviorSubjectContactForm.next({
            isAttended: true,
            payload: this.dataAlarmSelect,
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
