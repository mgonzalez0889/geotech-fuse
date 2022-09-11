import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MobileService } from 'app/core/services/mobile.service';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-mobiles',
    templateUrl: './grid-mobiles.component.html',
    styleUrls: ['./grid-mobiles.component.scss'],
})
export class GridMobilesComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableMobiles: MatTableDataSource<any>;
    public mobilesCount: number = 0;
    public columnsMobiles: string[] = [
        'plate',
        'internal_code',
        'driver',
        'model',
        'type_mobile',
    ];

    constructor(
        private ownerPlateService: OwnerPlateService,
        private mobileService: MobileService
    ) {}

    ngOnInit(): void {
        this.getMobiles();
        this.listenObservables();
    }
    /**
     * @description: Trae todos los moviles del cliente
     */
    public getMobiles(): void {
        this.ownerPlateService.getOwnerPlates().subscribe((res) => {
            if (res.data) {
                this.mobilesCount = res.data.length;
            } else {
                this.mobilesCount = 0;
            }
            this.dataTableMobiles = new MatTableDataSource(res.data);
            this.dataTableMobiles.paginator = this.paginator;
            this.dataTableMobiles.sort = this.sort;
        });
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableMobiles.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda el ID del mobil para abrirlo en el formulario
     */
    public actionsContact(id: number): void {
        this.opened = true;
        this.mobileService.behaviorSubjectMobileForm.next({
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
            this.mobileService.behaviorSubjectMobileGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getMobiles();
                    }
                }
            );
    }
}
