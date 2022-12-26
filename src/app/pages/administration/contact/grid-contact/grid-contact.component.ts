import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslocoService } from '@ngneat/transloco';
import { ContactService } from 'app/core/services/api/contact.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';

@Component({
  selector: 'app-grid-contact',
  templateUrl: './grid-contact.component.html',
  styleUrls: ['./grid-contact.component.scss'],
})
export class GridContactComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public subscription: Subscription;
  public opened: boolean = false;
  public dataTableContact: MatTableDataSource<any>;
  public contactsCount: number = 0;
  public listPermission: any = [];
  public subTitlePage: string = '';
  public columnsContact: string[] = [
    'name',
    'identification',
    'address',
    'email',
    'cellPhone',
  ];
  private permissionValid: { [key: string]: string } = {
    addContacto: 'administracion:contactos:create',
    updateContacto: 'administracion:contactos:update',
    deleteContacto: 'administracion:contactos:delete',
  };
  private unsubscribe$ = new Subject<void>();
  private userData: any;

  constructor(
    private toastAlert: ToastAlertService,
    private permissionsService: NgxPermissionsService,
    private contactService: ContactService,
    private translocoService: TranslocoService

  ) { }

  ngOnInit(): void {
    this.getContact();
    this.listenObservables();
    this.subscription = this.permissionsService.permissions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.listPermission = data ?? [];
        }
      );
    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribe$), delay(100))
      .subscribe(() => {
        const { subTitlePage } = this.translocoService.translateObject('users', { subTitlePage: { value: this.userData?.length } });
        this.subTitlePage = subTitlePage;
      });
  }
  /**
   * @description: Trae todos los contactos del cliente
   */
  public getContact(): void {
    this.contactService.getContacts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        if (res.data) {
          this.contactsCount = res.data.length;
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
   * @description: Crear un nuevo contacto
   */
  public newContact(): void {
    if (!this.listPermission[this.permissionValid.addContacto]) {
      this.toastAlert.toasAlertWarn({
        message:
          'messageAlert.messagePermissionWarn',
      });
    } else {
      this.opened = true;
      this.contactService.behaviorSubjectContactForm.next({
        newContact: 'contacts.formPage.formName',
      });
    }
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
      this.contactService.behaviorSubjectContactGrid.subscribe(
        ({ reload, opened }) => {
          this.opened = opened;
          if (reload) {
            this.getContact();
          }
        }
      );
  }
}
