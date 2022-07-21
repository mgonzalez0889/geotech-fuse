/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlCenterService } from 'app/core/services/control-center.service';

@Component({
    selector: 'app-control-center-dashboard',
    templateUrl: './control-center-dashboard.component.html',
    styleUrls: ['./control-center-dashboard.component.scss'],
})
export class ControlCenterDashboardComponent implements OnInit {
    public opened: boolean  = false;
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
}
