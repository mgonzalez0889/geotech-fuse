/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from '@services/api/driver.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { IconsModule } from 'app/core/icons/icons.module';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-form-driver',
  templateUrl: './form-driver.component.html',
  styleUrls: ['./form-driver.component.scss'],
})
export class FormDriverComponent implements OnInit, OnDestroy {
  public drivers: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public countries: any = [];
  public driverForm: FormGroup;
  public subscription: Subscription;
  public subscription2: Subscription;
  public listPermission: any = [];
  private permissionValid: { [key: string]: string } = {
    addContacto: 'administracion:conductores:create',
    updateDriver: 'administracion:conductores:update',
    deleteDriver: 'administracion:conductores:delete',
  };

  constructor(
    private driverServce: DriverService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private iconService: IconsModule,
    private permissionsService: NgxPermissionsService,
    private toastAlert: ToastAlertService,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.iconService.getCountries().subscribe((res) => {
      this.countries = res;
    });
    this.listenObservables();
    this.createDriverForm();
    this.subscription = this.permissionsService.permissions$.subscribe(
      (data) => {
        this.listPermission = data ?? [];
      }
    );
  }
  getCountryByIso(code: string): any {
    if (code) {
      return this.countries.find((country: any) => country.code === code);
    }
  }
  /**
   * @description: Valida si es edita o guarda un conductor nuevo
   */
  public onSave(): void {
    const data = this.driverForm.getRawValue();
    if (!data.id) {
      this.newDriver(data);
    } else {
      if (!this.listPermission[this.permissionValid.updateDriver]) {
        this.toastAlert.toasAlertWarn({
          message:
            'messageAlert.messagePermissionWarn',
        });
      } else {
        this.editDriver(data);
      }
    }
  }
  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.driverServce.behaviorSubjectDriverGrid.next({
      opened: false,
      reload: false,
    });
  }
  /**
   * @description: Elimina el conductor
   */
  public deleteContact(id: number): void {
    if (!this.listPermission[this.permissionValid.deleteDriver]) {
      this.toastAlert.toasAlertWarn({
        message:
          'messageAlert.messagePermissionWarn',
      });
      return;
    }
    const confirmation = this.confirmationService.open({
      title: this.translocoService.translate('driver.messageAlert.deleteDriver'),
      message:
        this.translocoService.translate('driver.messageAlert.deleteDriverMessage'),
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.driverServce.deleteDrivers(id).subscribe((res) => {
          if (res.code === 200) {
            this.driverServce.behaviorSubjectDriverGrid.next({
              reload: true,
              opened: false,
            });

            this.toastAlert.toasAlertSuccess({
              message: 'driver.messageAlert.deleteSuccess'
            });
          } else {
            this.toastAlert.toasAlertWarn(
              { message: 'driver.messageAlert.deleteFailure' }
            );
          }
        });
      }
    });
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
  /**
   * @description: Inicializa el formulario de conductores
   */
  private createDriverForm(): void {
    this.driverForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      license: ['', [Validators.required]],
      license_end: [new Date(), [Validators.required]],
      indicative: ['+57', [Validators.required]],
    });
  }
  /**
   * @description: Escucha el observable behavior y busca al conductor
   */
  private listenObservables(): void {
    this.subscription2 =
      this.driverServce.behaviorSubjectDriverForm.subscribe(
        ({ newDriver, id, isEdit }) => {
          this.editMode = isEdit;
          if (newDriver) {
            this.drivers = [];
            // this.drivers['name'] = newDriver;
            if (this.driverForm) {
              this.driverForm.reset();
              this.driverForm.controls['indicative'].setValue(
                '+57'
              );
              this.driverForm.controls['license_end'].setValue(
                new Date()
              );
            }
          }
          if (id) {
            this.driverServce
              .getDriver(id)
              .subscribe((data: any) => {
                this.drivers = data.data;
                this.driverForm.patchValue(this.drivers);
              });
          }
        }
      );
  }
  /**
   * @description: Editar un conductor
   */
  private editDriver(data: any): void {
    this.driverForm.disable();
    const confirmation = this.confirmationService.open({
      title: this.translocoService.translate('driver.messageAlert.editDriver'),
      message:
        this.translocoService.translate('driver.messageAlert.editDriverMessage'),
      icon: {
        name: 'heroicons_outline:pencil',
        color: 'info',
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.driverServce.putDrivers(data).subscribe((res) => {
          this.driverForm.enable();
          if (res.code === 200) {
            this.driverServce.behaviorSubjectDriverGrid.next({
              reload: true,
              opened: false,
            });

            this.toastAlert.toasAlertSuccess({
              message: 'driver.messageAlert.addsuccess.'
            });
          } else {
            this.toastAlert.toasAlertWarn(
              { message: 'driver.messageAlert.addFailure' }
            );
          }
        });
      }
    });
  }
  /**
   * @description: Guarda un nuevo conductor
   */
  private newDriver(data: any): void {
    this.driverForm.disable();
    this.driverServce.postDrivers(data).subscribe((res) => {
      this.driverForm.enable();
      if (res.code === 200) {
        this.driverServce.behaviorSubjectDriverGrid.next({
          reload: true,
          opened: false,
        });

        this.toastAlert.toasAlertSuccess({
          message: 'Conductor creado con exito.'
        });
      } else {
        this.toastAlert.toasAlertWarn(
          { message: 'El conductor no se pudo crear, favor intente nuevamente.' }
        );
      }
    });
  }
}
