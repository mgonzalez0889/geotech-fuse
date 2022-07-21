/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactService } from 'app/core/services/contact.service';

@Component({
    selector: 'app-grid-contact',
    templateUrl: './grid-contact.component.html',
    styleUrls: ['./grid-contact.component.scss'],
})
export class GridContactComponent implements OnInit {
    public opened: boolean = false;
    public dataTableContact: MatTableDataSource<any>;
    public contactsCount: number = 0;
    public columnsContact: string[] = ['name', 'address', 'email', 'cellPhone'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private contactService: ContactService) {}

    ngOnInit(): void {
        //this.getContact();
        this.listenObservables();
    }
    /**
     * @description: Trael todos los contactos del cliente
     */
    public getContact(): void {
        this.contactService.getContacts().subscribe((data) => {
            this.contactsCount = data.data.length;
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
        this.contactService.behaviorSubjectContactId$.next({
            id: id,
            newContact: true,
        });
    }
    private listenObservables(): void {
        this.contactService.behaviorSubjectContactActions$.subscribe(
            ({ reload, opened }) => {
                console.log(reload, opened, 'ssssssss');
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
        this.contactService.behaviorSubjectContactId$.next({ newContact: true });
    }
}
