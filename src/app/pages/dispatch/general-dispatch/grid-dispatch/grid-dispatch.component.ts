/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DispatchService } from 'app/core/services/dispatch.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-dispatch',
    templateUrl: './grid-dispatch.component.html',
    styleUrls: ['./grid-dispatch.component.scss'],
})
export class GridDispatchComponent implements OnInit, OnDestroy {
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableDispatch: MatTableDataSource<any>;
    public dispatchCount: number = 0;
    public columnsDispatch: string[] = [
        'spreadsheet',
        'client',
        'date_init_operation',
        'plate',
        'device',
        'container_number',
        'state',
        'init_place',
        'end_place',
        'data_driver',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private dispatchService: DispatchService,
        private dateAdapter: DateAdapter<any>
    ) {
        this.dateAdapter.setLocale('es');
    }

    ngOnInit(): void {
        this.getDispatch();
        this.listenObservables();
    }
    /**
     * @description: Trae todos los despachos del cliente
     */
    public getDispatch(): void {
        const data = {
            dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
            dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
            status: [0, 1, 2],
        };
        this.dispatchService.getDispatches(data).subscribe((res) => {
            if (res.data) {
                this.dispatchCount = res.data.length;
            } else {
                this.dispatchCount = 0;
            }
            this.dataTableDispatch = new MatTableDataSource(res.data);
            this.dataTableDispatch.paginator = this.paginator;
            this.dataTableDispatch.sort = this.sort;
        });
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableDispatch.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda el ID del despacho para aburirlo en el formulario
     */
    public actionsDispatch(id: number): void {
        this.opened = true;
        this.dispatchService.behaviorSubjectDispatchForm.next({
            id: id,
            isEdit: false,
        });
    }
    /**
     * @description: Crear un nuevo despacho
     */
    public newDispatch(): void {
        this.opened = true;
        this.dispatchService.behaviorSubjectDispatchForm.next({
            newDispatch: 'Nuevo despacho',
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription =
            this.dispatchService.behaviorSubjectDispatchGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getDispatch();
                    }
                }
            );
    }
}
