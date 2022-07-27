/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlCenterService } from 'app/core/services/control-center.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-control-center-dashboard',
    templateUrl: './control-center-dashboard.component.html',
    styleUrls: ['./control-center-dashboard.component.scss'],
})
export class ControlCenterDashboardComponent implements OnInit, OnDestroy {
    public subscription: Subscription;
    public dataAlarmSelect = [];
    public opened: boolean = false;
    public dataAlarms: MatTableDataSource<any>;
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

    constructor(private controlCenterService: ControlCenterService) {}

    ngOnInit(): void {
        this.getAllAlarms();
        this.listenObservables();
    }
    /**
     * @description: Trae tolas las alarmas
     */
    private getAllAlarms(): void {
        this.controlCenterService.getAllAlarms().subscribe((data) => {
            this.dataAlarms = new MatTableDataSource(data.data);
            this.dataAlarms.paginator = this.paginator;
            this.dataAlarms.sort = this.sort;
        });
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
    /**
     * @description: Guarda la data de la alarma para aburir el formulario
     */
    public actionsControlCenter(data: any): void {
        this.opened = true;
        this.dataAlarmSelect = data;
        console.log(data, 'sssss');
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
