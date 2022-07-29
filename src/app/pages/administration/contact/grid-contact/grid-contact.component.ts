/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactService } from 'app/core/services/contact.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-contact',
    templateUrl: './grid-contact.component.html',
    styleUrls: ['./grid-contact.component.scss'],
})
export class GridContactComponent implements OnInit, OnDestroy {
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableContact: MatTableDataSource<any>;
    public contactsCount: number = 0;
    public columnsContact: string[] = [
        'name',
        'identification',
        'address',
        'email',
        'cellPhone',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private contactService: ContactService) {}

    ngOnInit(): void {
        this.getContact();
        this.listenObservables();
    }
    /**
     * @description: Trae todos los contactos del cliente
     */
    public getContact(): void {
        this.contactService.getContacts().subscribe((data) => {
            if (data.data) {
                this.contactsCount = data.data.length;
            } else {
                this.contactsCount = 0;
            }
            this.dataTableContact = new MatTableDataSource(data.data);
            this.dataTableContact.paginator = this.paginator;
            this.dataTableContact.sort = this.sort;
        });
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableContact.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda el ID del contacto para aburirlo en el formulario
     */
    public actionsContact(id: number): void {
        this.opened = true;
        this.contactService.behaviorSubjectContactForm.next({
            id: id,
            isEdit: false,
        });
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription =
            this.contactService.behaviorSubjectContactGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getContact();
                    }
                }
            );
    }
    /**
     * @description: Crear un nuevo contacto
     */
    public newContact(): void {
        this.opened = true;
        this.contactService.behaviorSubjectContactForm.next({
            newContact: 'Nuevo contacto',
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
