import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ProfilesService } from 'app/core/services/api/profiles.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IOptionTable } from '../../../../core/interfaces/components/table.interface';
import { ToastAlertService } from '../../../../core/services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-grid-profile',
  templateUrl: './grid-profile.component.html',
  styleUrls: ['./grid-profile.component.scss'],
})
export class GridProfileComponent implements OnInit, OnDestroy {
  public titlePage: string = 'Gestion de perfiles';
  public titleForm: string = '';
  public subTitlepage: string = '';
  public opened: boolean = false;
  public dataFilter: string = '';
  public profileDataUpdate: any = null;
  public profileData: any[] = [];
  public listPermission: any = [];
  public columnsProfile: string[] = ['name', 'description'];
  public optionsTable: IOptionTable[] = [
    {
      name: 'name',
      text: 'Nombre',
      typeField: 'text',
    },
    {
      name: 'description',
      text: 'Descripción',
      typeField: 'text',
    },
  ];
  private permissionValid: { [key: string]: string } = {
    addProfile: 'administracion:perfiles:create',
    updateProfile: 'administracion:perfiles:update',
    deleteProfile: 'administracion:perfiles:delete',
  };
  private unsubscribe$ = new Subject<void>();

  constructor(
    private permissionsService: NgxPermissionsService,
    private confirmationService: ConfirmationService,
    private profileService: ProfilesService,
    private toastAlert: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.getProfiles();
    this.listenObservables();

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

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }



  /**
   * @description: Se abre el formulario para crear un nuevo perfil
   */
  public addProfileForm(): void {
    if (!this.listPermission[this.permissionValid.addProfile]) {
      this.toastAlert.openAlert({
        message: 'No tienes permisos suficientes para realizar esta acción.',
        actionMessage: 'cerrar',
        styleClass: 'alert-warn'
      });
    } else {
      this.opened = true;
      this.titleForm = 'Crear Perfil';
      this.profileDataUpdate = null;
    }
  }

  /**
   * @description: Cuando se seleccione cualquier registro de la tabla se ejecuta esta funcion y se habilita el formulario para modificar el perfil.
   */
  public actionSelectTable(data: any): void {
    this.opened = true;
    this.profileDataUpdate = { ...data };
    this.titleForm = 'Editar perfil';
  }

  /**
   * @description: Leemos todos los perfiles que el usuario logueado tenga asignados
   */
  private getProfiles(): void {
    this.profileService.getProfiles().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.subTitlepage = res.data
        ? `${res.data.length} perfiles`
        : 'Sin perfiles';

      this.profileData = res.data || [];
    });
  }

  /**
   * @description: Elimina cualquier perfil.
   */
  private deleteProfile(profileId: number): void {
    if (!this.listPermission[this.permissionValid.deleteProfile]) {
      this.toastAlert.openAlert({
        message: 'No tienes permisos suficientes para realizar esta acción.',
        actionMessage: 'cerrar',
        styleClass: 'alert-warn'
      });
    } else {
      const confirmation = this.confirmationService.open();
      confirmation.afterClosed().pipe(takeUntil(this.unsubscribe$)).subscribe((result) => {
        if (result === 'confirmed') {
          this.profileService.deleteProfile(profileId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.opened = false;
            this.getProfiles();
            this.toastAlert.openAlert({
              message: 'Perfil eliminado con exito.',
              styleClass: 'alert-success'
            });
          });
        }
      });
    }
  }

  /**
   * @description: Escucha cuando se active alguna acion del formulario.
   */
  private listenObservables(): void {
    this.profileService.profileForm$.subscribe(({ formData, typeAction, profileId }) => {
      if (typeAction === 'add') {
        this.profileService.postProfile(formData).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
          this.opened = false;
          this.getProfiles();
          this.toastAlert.openAlert({
            message: `Perfil ${formData.name} creado con exito.`,
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
          this.profileService.putProfile(formData, profileId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.opened = false;
            this.getProfiles();
            this.toastAlert.openAlert({
              message: 'Perfil modificado con exito.',
              styleClass: 'alert-success'
            });
          });
        }
      } else if (typeAction === 'delete') {
        this.deleteProfile(formData.id);
      }
    });
  }

}
