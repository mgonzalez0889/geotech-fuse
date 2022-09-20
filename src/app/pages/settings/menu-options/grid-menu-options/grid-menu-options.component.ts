import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MenuOptionsService } from 'app/core/services/menu-options.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-menu-options',
    templateUrl: './grid-menu-options.component.html',
    styleUrls: ['./grid-menu-options.component.scss'],
})
export class GridMenuOptionsComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableMenu: MatTableDataSource<any>;
    public menuCount: number = 0;
    public columnsMenu: string[] = ['name', 'description'];
    constructor(private menuOptionsService: MenuOptionsService) {}

    ngOnInit(): void {
        this.getMenuOption();
        this.listenObservables();
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableMenu.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getMenuOption(): void {
        this.menuOptionsService.getMenuOptionsNew().subscribe((res) => {
            console.log(res,'arturo');

            if (res.data) {
                this.menuCount = res.data.length;
            } else {
                this.menuCount = 0;
            }
            this.dataTableMenu = new MatTableDataSource(res.data);
            this.dataTableMenu.paginator = this.paginator;
            this.dataTableMenu.sort = this.sort;
        });
    }
    /**
     * @description: Crear una nueva opción
     */
    public newMenu(): void {
        this.opened = true;
        this.menuOptionsService.behaviorSubjectMenuForm.next({
            newOption: 'Nueva opción',
        });
    }

    /**
     * @description: Guarda el ID del contacto para aburirlo en el formulario
     */
    public actionsMenu(id: number): void {
        this.opened = true;
        this.menuOptionsService.behaviorSubjectMenuForm.next({
            id: id,
            isEdit: false,
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
            this.menuOptionsService.behaviorSubjectMenuGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getMenuOption();
                    }
                }
            );
    }
}
