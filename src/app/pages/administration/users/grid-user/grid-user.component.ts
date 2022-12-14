import { Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, takeUntil } from 'rxjs/operators';
import { NgxPermissionsObject } from 'ngx-permissions';
import { AuthService } from 'app/core/auth/auth.service';
import { TranslocoService } from '@ngneat/transloco';
import { IOptionTable } from '@interface/index';
import { UsersService } from '@services/api/users.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';

@Component({
  selector: 'app-grid-user',
  templateUrl: './grid-user.component.html',
  styleUrls: ['./grid-user.component.scss'],
})
export class GridUserComponent implements OnInit, OnDestroy {
  public subTitlePage: string = '';
  public titlePage: string = '';
  public titleForm: string = '';
  public opened: boolean = false;
  public userData: any[] = [];
  public dataFilter: string = '';
  public userDataUpdate: any = null;
  public optionsTable: IOptionTable[] = [
    {
      name: 'user_login',
      text: 'users.tablePage.username',
      typeField: 'text',
    },
    {
      name: 'full_name',
      text: 'users.tablePage.fullname',
      typeField: 'text',
    },
    {
      name: 'profile',
      text: 'users.tablePage.profile',
      typeField: 'text',
    },
    {
      name: 'email',
      text: 'users.tablePage.email',
      typeField: 'text',
      classTailwind: 'hover:underline text-primary-500',
    },
    {
      name: 'enable_user',
      text: 'users.tablePage.state',
      typeField: 'switch',
    },
  ];
  public displayedColumns: string[] = [
    ...this.optionsTable.map(({ name }) => name),
  ];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addUser: 'administracion:usuarios:create',
    updateUser: 'administracion:usuarios:update',
    deleteUser: 'administracion:usuarios:delete',
  };
  private unsubscribe$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private confirmationService: ConfirmationService,
    private toastAlert: ToastAlertService,
    private authService: AuthService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.readDataUser();
    this.listenFormUser();
    this.authService.permissionList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((permission) => {
        this.listPermission = permission;
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribe$), delay(100))
      .subscribe(() => {
        const { subTitlePage } = this.translocoService.translateObject('users', { subTitlePage: { value: this.userData.length } });
        const { titlePage } = this.translocoService.getTranslation('users');
        this.titlePage = titlePage;
        this.subTitlePage = subTitlePage;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: funcion para abrir formulario de usuario.
   */
  public addUserForm(): void {
    if (!this.listPermission[this.permissionValid.addUser]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
    } else {
      this.opened = true;
      this.titleForm = 'users.formPage.formNameCreate';
      this.userDataUpdate = null;
    }
  }

  /**
   * @description: Cuando se seleccione cualquier usuario de la tabla se ejecuta esta funcion y se habilita el formulario para modificarlo.
   */
  public selectUserTable(dataUser: any): void {
    this.userDataUpdate = { ...dataUser };
    this.opened = true;
    this.titleForm = 'users.formPage.formNameUpdate';
  }

  /**
   * @description: resibe evento de la tabla cuando cambie el valor de el switch de estado de usuario.
   */
  public changeEnableUser(dataEvent: { state: boolean; data: any }): void {
    if (!this.listPermission[this.permissionValid.updateUser]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }

    this.usersService
      .changeEnableUser(dataEvent.data.id, dataEvent.state)
      .subscribe((data) => {
        if (data.code === 400) {
          this.toastAlert.toasAlertWarn({
            message:
              'No se puedo modificar el estado, intentelo de nuevo.',
          });
        } else {
          this.toastAlert.toasAlertSuccess({
            message: 'Estado de Usuario modificado con exito.',
          });
        }
      });
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: leemos todos los registros de usuario.
   */
  private readDataUser(): void {
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        const { subTitlePage } = this.translocoService.translateObject('users', { subTitlePage: { value: data.length } });
        this.subTitlePage = subTitlePage;
        this.userData = [...(data || [])];
      });
  }

  /**
   * @description: Eliminamos un usuario.
   */
  private deleteUser(userId: number): void {
    const confirmation = this.confirmationService.open();
    confirmation
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result === 'confirmed') {
          this.usersService
            .deleteUser(userId)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
              this.readDataUser();
              this.opened = false;
              if (data.code === 400) {
                this.toastAlert.toasAlertWarn({
                  message:
                    'No se puedo eliminar el usuario, intentelo de nuevo.',
                });
              } else {
                this.toastAlert.toasAlertSuccess({
                  message: 'Usuario eliminado con exito.',
                });
              }
            });
        }
      });
  }

  /**
   * @description: escuchamos los eventos del formulario de usuarios.
   */
  private listenFormUser(): void {
    this.usersService.userForm$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ formData, typeAction }) => {
        if (typeAction === 'add') {
          this.usersService.postUser(formData).subscribe((data) => {
            this.opened = false;
            this.readDataUser();
            if (data.code === 400) {
              this.toastAlert.toasAlertWarn({
                message:
                  'No se puedo crear el usuario, intentelo de nuevo.',
              });
            } else {
              this.toastAlert.toasAlertSuccess({
                message: `Usuario ${formData.full_name} creado con exito.`,
              });
            }
          });
        } else if (typeAction === 'edit') {
          if (!this.listPermission[this.permissionValid.updateUser]) {
            this.toastAlert.toasAlertWarn({
              message:
                'No tienes permisos suficientes para realizar esta acción.',
            });
            return;
          }
          this.usersService
            .putUser(formData)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
              this.opened = false;
              this.readDataUser();
              if (data.code === 400) {
                this.toastAlert.toasAlertWarn({
                  message:
                    'No se puedo modificar el usuario, intentelo de nuevo.',
                });
              } else {
                this.toastAlert.toasAlertSuccess({
                  message: 'Usuario modificado con exito.',
                });
              }
            });
        } else if (typeAction === 'delete') {
          if (!this.listPermission[this.permissionValid.deleteUser]) {
            this.toastAlert.toasAlertWarn({
              message:
                'No tienes permisos suficientes para realizar esta acción.',
            });
          } else {
            this.deleteUser(formData.id);
          }
        }
      });
  }
}
