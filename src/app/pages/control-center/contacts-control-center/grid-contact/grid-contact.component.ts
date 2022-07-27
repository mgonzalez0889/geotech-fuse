/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ControlCenterService } from 'app/core/services/control-center.service';
import { OwnersService } from 'app/core/services/owners.service';
import { UsersService } from 'app/core/services/users.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-contact',
    templateUrl: './grid-contact.component.html',
    styleUrls: ['./grid-contact.component.scss'],
})
export class GridContactComponent implements OnInit, OnDestroy {
    public subscription: Subscription;
    public ownerId: number;
    public opened: boolean = false;
    public owners;
    public ownerSelect;
    public dataTableContactsControlCenter: MatTableDataSource<any>;
    public contactsCount: number = 0;
    public columnsContactsControlCenter: string[] = [
        'name',
        'identification',
        'type_contacs',
        'address',
        'email',
        'cellPhone',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private controlCenterService: ControlCenterService,
        private ownersService: OwnersService,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.listenObservables();
        this.getInfoUser();
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getContactsControlCenter(ownerId: number): void {
        this.opened = false;
        this.controlCenterService
            .getContactsControlCenter(ownerId)
            .subscribe((data) => {
                if (data.data) {
                    this.contactsCount = data.data.length;
                }
                this.dataTableContactsControlCenter = new MatTableDataSource(
                    data.data
                );
                this.dataTableContactsControlCenter.paginator = this.paginator;
                this.dataTableContactsControlCenter.sort = this.sort;
            });
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableContactsControlCenter.filter = filterValue
            .trim()
            .toLowerCase();
    }
    /**
     * @description: Guarda el ID del contacto para aburirlo en el formulario
     */
    public actionsContact(id: number): void {
        this.opened = true;
        this.controlCenterService.behaviorSubjectContactForm.next({
            id: id,
            isEdit: false,
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
                        this.getContactsControlCenter(this.ownerId);
                    }
                }
            );
    }
    /**
     * @description: Crear un nuevo contacto
     */
    public newContact(): void {
        this.opened = true;
        this.controlCenterService.behaviorSubjectContactForm.next({
            newContact: 'Nuevo contacto',
        });
    }
    /**
     * @description: Trae todos los clientes
     */
    private getOwners(): void {
        this.ownersService.getOwners().subscribe((res) => {
            this.owners = res.data;
        });
    }
    /**
     * @description: Trae la informacion del usuario
     */
    private getInfoUser(): void {
        this.usersService.getInfoUser().subscribe((res) => {
            this.ownerId = res.data.owner_id;
            console.log(this.ownerId);
            if (this.ownerId === 1) {
                console.log('entro');
                this.getOwners();
            }
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
