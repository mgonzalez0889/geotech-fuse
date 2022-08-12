/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FleetsService } from 'app/core/services/fleets.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-fleet',
    templateUrl: './grid-fleet.component.html',
    styleUrls: ['./grid-fleet.component.scss'],
})
export class GridFleetComponent implements OnInit, OnDestroy {
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableFleet: MatTableDataSource<any>;
    public fleetsCount: number = 0;
    public columnsFleet: string[] = ['name', 'description'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private fleetService: FleetsService) {}

    ngOnInit(): void {
        this.getFleets();
        this.listenObservables();
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableFleet.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda el ID del contacto para aburirlo en el formulario
     */
    public actionsFleet(id: any): void {
        this.opened = true;
        this.fleetService.behaviorSubjectFleetForm.next({
            payload: id,
            isEdit: false,
        });
    }
    /**
     * @description: Crear un nuevo contacto
     */
    public newFleet(): void {
        this.opened = true;
        this.fleetService.behaviorSubjectFleetForm.next({
            newFleet: 'Nueva flota',
            payload: null,
        });
    }
    /**
     * @description: Mostrar todas las flotas del cliente
     */
    public getFleets(): void {
        this.fleetService.getFleets().subscribe((res) => {
            if (res.data) {
                this.fleetsCount = res.data.length;
            } else {
                this.fleetsCount = 0;
            }
            this.dataTableFleet = new MatTableDataSource(res.data);
            this.dataTableFleet.paginator = this.paginator;
            this.dataTableFleet.sort = this.sort;
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
            this.fleetService.behaviorSubjectFleetGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getFleets();
                    }
                }
            );
    }
}
