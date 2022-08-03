/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ContactService } from 'app/core/services/contact.service';
import { EventsService } from 'app/core/services/events.service';
import { Subscription } from 'rxjs';
import { contacts } from '../../../../mock-api/apps/chat/data';

@Component({
    selector: 'app-form-events',
    templateUrl: './form-events.component.html',
    styleUrls: ['./form-events.component.scss'],
})
export class FormEventsComponent implements OnInit, OnDestroy {
    public selection = new SelectionModel<any>(true, []);
    public contactsId: any = [];
    public contactsCount: number = 0;
    public events: any = [];
    public opened: boolean = true;
    public eventForm: FormGroup;
    public subscription: Subscription;
    public dataTableContact: MatTableDataSource<any>;
    public columnsContact: string[] = [
        'select',
        'name',
        'identification',
        'address',
        'email',
        'cellPhone',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private eventsService: EventsService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private contactService: ContactService
    ) {}

    ngOnInit(): void {
        this.getContact();
        this.createEventsForm();
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
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataTableContact.data.length;
        return numSelected === numRows;
    }
    public saveEvent(): void {
        this.contactsId = [];
        this.selection.selected.forEach((x) => {
            this.contactsId.push(x.id);
        });
        this.eventForm.patchValue({ contact_id: this.contactsId });
        const data =this.eventForm.getRawValue();
        console.log(data,'data')
    }
    /**
     * @description: Funcion boton cancelar
     */
    public onCancel(): void {
        this.eventsService.behaviorSubjectEventGrid.next({
            opened: false,
            reload: false,
        });
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    toggleAllRows() {
        if (this.isAllSelected()) {
            this.selection.clear();
            return;
        }

        this.selection.select(...this.dataTableContact.data);
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
    /**
     * @description: Formulario de modulo eventos
     */
    private createEventsForm(): void {
        this.eventForm = this.fb.group({
            id: [''],
            event_name: ['', [Validators.required]],
            color: ['', [Validators.required]],
            email: [''],
            page: [''],
            sms: [''],
            sound: [''],
            contact_id: [''],
            description: ['', [Validators.required]],
        });
    }
    /**
     * @description: Escucha el observable behavior y busca al contacto
     */
    private listenObservables(): void {
        this.subscription =
            this.eventsService.behaviorSubjectEventForm.subscribe(({ id }) => {
                if (id) {
                    this.eventsService.getEvent(id).subscribe((res) => {
                        this.events = res.data;
                        this.eventForm.patchValue(this.events);
                    });
                }
            });
    }
}
