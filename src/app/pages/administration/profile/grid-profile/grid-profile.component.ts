import { Subject } from 'rxjs';
import { IOptionTable } from '@interface/index';
import { TranslocoService } from '@ngneat/transloco';
import { delay, map, takeUntil } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfilesService } from '@services/api/profiles.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';

@Component({
  selector: 'app-grid-profile',
  templateUrl: './grid-profile.component.html',
  styleUrls: ['./grid-profile.component.scss'],
})
export class GridProfileComponent implements OnInit, OnDestroy {
  public titleForm: string = '';
  public subTitlePage: string = '';
  public opened: boolean = false;
  public dataFilter: string = '';
  public profileDataUpdate: any = null;
  public profileData: any[] = [];
  public listPermission: any = [];
  public columnsProfile: string[] = ['name', 'description'];
  public optionsTable: IOptionTable[] = [
    {
      name: 'name',
      text: 'profile.tablePage.name',
      typeField: 'text',
    },
    {
      name: 'description',
      text: 'profile.tablePage.description',
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
    private toastAlert: ToastAlertService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.getProfiles();
    this.listenObservables();

    this.permissionsService.permissions$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.listPermission = data ?? [];
      });

    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribe$), delay(100))
      .subscribe(() => {
        const { subTitlePage } = this.translocoService.translateObject('profile', { subTitlePage: { value: this.profileData.length } });
        this.subTitlePage = subTitlePage;
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
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });
    } else {
      this.opened = true;
      this.titleForm = 'profile.formPage.formNameCreate';
      this.profileDataUpdate = null;
    }
  }

  /**
   * @description: Cuando se seleccione cualquier registro de la tabla se ejecuta esta funcion y se habilita el formulario para modificar el perfil.
   */
  public actionSelectTable(data: any): void {
    this.opened = true;
    this.profileDataUpdate = { ...data };
    this.titleForm = 'profile.formPage.formNameUpdate';
  }

  /**
   * @description: Leemos todos los perfiles que el usuario logueado tenga asignados
   */
  private getProfiles(): void {
    this.profileService.getProfiles()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(({ data }) =>
          data?.map(values => ({
            ...values.profile,
            plates: values.plate,
            fleets: values.fleets,
            modules: values.modules
          }))
        )
      )
      .subscribe((profileData) => {
        const { subTitlePage } = this.translocoService.translateObject('profile', { subTitlePage: { value: profileData.length } });
        this.subTitlePage = subTitlePage;
        this.profileData = profileData || [];
      });
  }

  /**
   * @description: Elimina cualquier perfil.
   */
  private deleteProfile(profileId: number): void {
    if (!this.listPermission[this.permissionValid.deleteProfile]) {
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });
    } else {
      const confirmation = this.confirmationService.open();
      confirmation.afterClosed()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          if (result === 'confirmed') {
            this.profileService.deleteProfile(profileId).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
              this.opened = false;
              this.getProfiles();
              this.toastAlert.toasAlertSuccess({
                message: 'Perfil eliminado con exito.',
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
    this.profileService.profileForm$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ formData, typeAction, profileId }) => {
        if (typeAction === 'add') {
          this.profileService.postProfile(formData)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => {
              this.opened = false;
              this.getProfiles();
              this.toastAlert.toasAlertSuccess({
                message: `Perfil ${formData.name} creado con exito.`,
              });
            });
        } else if (typeAction === 'edit') {
          if (!this.listPermission[this.permissionValid.updateProfile]) {
            this.toastAlert.toasAlertWarn({
              message: 'No tienes permisos suficientes para realizar esta acción.',
            });
          } else {
            this.profileService.putProfile(formData, profileId)
              .pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
                this.opened = false;
                this.getProfiles();
                this.toastAlert.toasAlertSuccess({
                  message: 'Perfil modificado con exito.',
                });
              });
          }
        } else if (typeAction === 'delete') {
          this.deleteProfile(formData.id);
        }
      });
  }

}
