/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ContactService } from 'app/core/services/api/contact.service';
import { EventsService } from 'app/core/services/api/events.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';

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
  private unsubscribe$ = new Subject<void>();

  constructor(
    private eventsService: EventsService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private contactService: ContactService,
    private translocoService: TranslocoService,
    private toastAlert: ToastAlertService,

  ) { }

  ngOnInit(): void {
    this.createEventsForm();
    this.listenObservables();
  }
  /**
   * @description: Trae todos los contactos del cliente
   */
  public getContact(contac?: any): void {
    this.contactService.getContacts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.selection.clear();
        if (res.data) {
          this.contactsCount = res.data.length;
          res.data.forEach((row: any) => {
            contac.forEach((x: any) => {
              if (row.id === x.id) {
                this.selection.select(row);
              }
            });
          });
        } else {
          this.contactsCount = 0;
        }
        this.dataTableContact = new MatTableDataSource(res.data);
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
   * @description: Si el número de elementos seleccionados coincide con el número total de filas.
   */
  public isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataTableContact.data?.length;
    return numSelected === numRows;
  }

  /**
   * @description: Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección.
   */
  public toggleAllRows(): any {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataTableContact.data);
  }
  /**
   * @description: Guarda los eventos
   */
  public saveEvent(): void {
    this.eventForm.disable();
    this.contactsId = [];
    this.selection.selected.forEach((x) => {
      this.contactsId.push(x.id);
    });
    this.eventForm.patchValue({ contact_id: this.contactsId });
    const data = this.eventForm.getRawValue();
    this.eventsService.putEvents(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.eventForm.enable();
        if (res.code === 200) {
          this.eventsService.behaviorSubjectEventGrid.next({
            opened: false,
            reload: true,
          });
          this.confirmationService.open({
            title: this.translocoService.translate('events.alertMessage.editMessageTitle'),
            message: this.translocoService.translate('events.alertMessage.editMessageTitleSuccess'),
            icon: {
              name: 'heroicons_outline:check-circle',
              color: 'success',
            },
          });

        } else {
          this.confirmationService.open({
            title: this.translocoService.translate('events.alertMessage.editMessageTitle'),
            message:
            this.translocoService.translate('events.alertMessage.editMessageTitleError'),

            icon: {
              show: true,
              name: 'heroicons_outline:exclamation',
              color: 'warn',
            },
          });
        }
      });
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

  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  /**
   * @description: Formulario de modulo eventos
   */
  private createEventsForm(): void {
    this.eventForm = this.fb.group({
      id: [''],
      event_name: ['', [Validators.required]],
      color: ['#563d7c', [Validators.required]],
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
    this.eventsService.behaviorSubjectEventForm
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ id }) => {
        if (id) {
          this.eventsService.getEvent(id).subscribe((res) => {
            this.getContact(res.contacts);
            this.events = res.data;
            this.eventForm.patchValue(this.events);
          });
        }
      });
  }
}
