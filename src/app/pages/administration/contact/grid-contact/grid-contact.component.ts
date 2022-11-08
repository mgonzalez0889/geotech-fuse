import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactService } from 'app/core/services/contact.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';

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
  constructor(private toastAlert: ToastAlertService, private permissionsService: NgxPermissionsService, private contactService: ContactService) { }

  ngOnInit(): void {
    this.getContact();
    this.listenObservables();

    this.subscription = this.permissionsService.permissions$
      .subscribe((data) => {
        console.log('permission', data);
        this.listPermission = data ?? [];
      });
  }
  /**
   * @description: Trae todos los contactos del cliente
   */
  public getContact(): void {
    this.contactService.getContacts().subscribe((res) => {
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
      this.toastAlert.openAlert({
        message: 'No tienes permisos suficientes para esta acción.',
        actionMessage: 'cerrar',
        styleClass: 'alert-warn'
      });
    } else {
      this.opened = true;
      this.contactService.behaviorSubjectContactForm.next({
        newContact: 'Nuevo contacto',
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
