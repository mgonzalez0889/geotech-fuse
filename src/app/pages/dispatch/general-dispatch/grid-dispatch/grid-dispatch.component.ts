import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DispathService } from 'app/core/services/dispath.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-dispatch',
    templateUrl: './grid-dispatch.component.html',
    styleUrls: ['./grid-dispatch.component.scss'],
})
export class GridDispatchComponent implements OnInit, OnDestroy {
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableDispath: MatTableDataSource<any>;
    public dispathCount: number = 0;
    public columnsDispath: string[] = [
        'name',
        'identification',
        'address',
        'email',
        'cellPhone',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private dispathService: DispathService) {}

    ngOnInit(): void {
        this.getDispath();
        this.listenObservables();
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getDispath(): void {
        this.dispathService.getDispaths().subscribe((res) => {
            if (res.data) {
                this.dispathCount = res.data.length;
            } else {
                this.dispathCount = 0;
            }
            this.dataTableDispath = new MatTableDataSource(res.data);
            this.dataTableDispath.paginator = this.paginator;
            this.dataTableDispath.sort = this.sort;
        });
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableDispath.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda el ID del contacto para aburirlo en el formulario
     */
    public actionsDispath(id: number): void {
        this.opened = true;
        this.dispathService.behaviorSubjectDispathForm.next({
            id: id,
            isEdit: false,
        });
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription =
            this.dispathService.behaviorSubjectDispathGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getDispath();
                    }
                }
            );
    }
    /**
     * @description: Crear un nuevo contacto
     */
    public newDispath(): void {
        this.opened = true;
        this.dispathService.behaviorSubjectDispathForm.next({
            newDispath: 'Nuevo despacho',
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
