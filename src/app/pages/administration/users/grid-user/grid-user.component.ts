import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../../../../core/services/users.service';
import { IOptionTable } from '../../../../core/interfaces/components/table.interface';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { takeUntil } from 'rxjs/operators';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-grid-user',
  templateUrl: './grid-user.component.html',
  styleUrls: ['./grid-user.component.scss'],
})
export class GridUserComponent implements OnInit, OnDestroy {
  public subTitlePage: string = '';
  public titlePage: string = 'Usuarios';
  public titleForm: string = '';
  public opened: boolean = false;
  public userData: any[] = [];
  public dataFilter: string = '';
  public userDataUpdate: any = null;
  public listPermission: any = [];
  public optionsTable: IOptionTable[] = [
    {
      name: 'user_login',
      text: 'Usuario',
      typeField: 'text'
    },
    {
      name: 'full_name',
      text: 'Nombre',
      typeField: 'text'
    },
    {
      name: 'profile',
      text: 'Perfil',
      typeField: 'text'
    },
    {
      name: 'email',
      text: 'Correo electrónico',
      typeField: 'text',
      classTailwind: 'hover:underline text-primary-500'
    },
    {
      name: 'status',
      text: 'Estado',
      typeField: 'switch'
    }
  ];

  public displayedColumns: string[] = [...this.optionsTable.map(({ name }) => name)];
  private permissionValid: { [key: string]: string } = {
    addUser: 'administracion:usuarios:create',
    updateUser: 'administracion:usuarios:update',
    deleteUser: 'administracion:usuarios:delete',
  };
  private unsubscribe$ = new Subject<void>();

  constructor(
    private permissionsService: NgxPermissionsService,
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private toastAlert: ToastAlertService
  ) { }


  ngOnInit(): void {
    this.readDataUser();
    this.listenFormUser();

    this.permissionsService.permissions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.listPermission = data ?? [];
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public addUserForm(): void {
    if (!this.listPermission[this.permissionValid.addUser]) {
      this.toastAlert.openAlert({
        message: 'No tienes permisos suficientes para realizar esta acción.',
        actionMessage: 'cerrar',
        styleClass: 'alert-warn'
      });
    } else {
      this.opened = true;
      this.titleForm = 'Crear usuario';
      this.userDataUpdate = null;
    }
  }

  /**
   * @description: Cuando se seleccione cualquier usuario de la tabla se ejecuta esta funcion y se habilita el formulario para modificarlo.
   */
  public selectUserTable(dataUser: any): void {
    this.userDataUpdate = { ...dataUser };
    this.opened = true;
    this.titleForm = 'Editar usuario';
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  private readDataUser(): void {
    this.usersService.getUsers().pipe(takeUntil(this.unsubscribe$)).subscribe(({ data }) => {
      this.subTitlePage = data
        ? `${data.length} Usuarios`
        : 'Sin usuarios';
      this.userData = [...data || []];
    });
  }

  private deleteUser(userId: number): void {
    const confirmation = this.confirmationService.open();
    confirmation.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
      if (result === 'confirmed') {
        this.usersService.deleteUser(userId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.readDataUser();
          this.opened = false;
        });
      }
    });
  }

  private listenFormUser(): void {
    this.usersService.userForm$.pipe(takeUntil(this.unsubscribe$)).subscribe(({ formData, typeAction }) => {
      if (typeAction === 'add') {
        this.usersService.postUser(formData).subscribe(() => {
          this.opened = false;
          this.readDataUser();
          this.toastAlert.openAlert({
            message: `Usuario ${formData.full_name} creado con exito.`,
            styleClass: 'alert-success'
          });
        });
      } else if (typeAction === 'edit') {
        if (!this.listPermission[this.permissionValid.updateProfile]) {
          this.toastAlert.openAlert({
            message: 'No tienes permisos suficientes para realizar esta acción.',
            actionMessage: 'cerrar',
            styleClass: 'alert-warn'
          });
        } else {
          this.usersService.putUser(formData).pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
            this.opened = false;
            this.readDataUser();
            this.toastAlert.openAlert({
              message: 'Usuario modificado con exito.',
              styleClass: 'alert-success'
            });
          });
        }
      } else if (typeAction === 'delete') {
        this.deleteUser(formData.id);
      }
    });
  }

}
