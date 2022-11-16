/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { DispatchService } from 'app/core/services/dispatch.service';
import { DriverService } from 'app/core/services/driver.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { NgxPermissionsObject } from 'ngx-permissions';
import { Subscription } from 'rxjs';
declare let google: any;

@Component({
  selector: 'app-form-dispatch',
  templateUrl: './form-dispatch.component.html',
  styleUrls: ['./form-dispatch.component.scss'],
})
export class FormDispatchComponent implements OnInit, OnDestroy {
  public prediction: any;
  public devices: any = [];
  public dispatches: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public dispatchForm: FormGroup;
  public subscription: Subscription;
  public drivers: any = [];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addDispatch: 'despachos:despachos:create',
    updateDispatch: 'despachos:despachos:update',
    deleteDispatch: 'despachos:despachos:delete',
  };
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private dispatchService: DispatchService,
    private driverService: DriverService,
    private toastAlert: ToastAlertService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.listenObservables();
    this.createContactForm();
    this.getDevicesDispatch();
    this.getDriver();
    this.authService.permissionList.subscribe((permission) => {
      this.listPermission = permission;
    });
  }

  /**
   * @description: Valida si es edita o guarda un despacho nuevo
   */
  public onSave(): void {
    if (this.dispatchForm.get('status').value === 1) {
      this.dispatchForm.controls['date_init_dispatch'].setValue(
        new Date()
      );
    }
    const data = this.dispatchForm.getRawValue();
    if (!data.id) {
      this.newDispatch(data);
    } else {
      if (!this.listPermission[this.permissionValid.addDispatch]) {
        this.toastAlert.toasAlertWarn({
          message: 'No tienes permisos suficientes para realizar esta acción.',
        });
      } else {
        this.editDispatch(data);
      }
    }
  }
  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.dispatchService.behaviorSubjectDispatchGrid.next({
      opened: false,
      reload: false,
    });
  }
  /**
   * @description: Modal para asignar un dispositivo al despacho
   */
  public startDispatch(): void {
    this.dispatchForm.disable();
    this.dispatchForm.controls['status'].setValue(1);
    if (this.dispatchForm.get('automatic_finish').value === false) {
      this.dispatchForm.controls['date_init_dispatch'].setValue(
        new Date()
      );
    }
    const data = this.dispatchForm.getRawValue();
    this.dispatchService.putDispatch(data).subscribe((res) => {
      this.dispatchForm.enable();
      if (res.code === 200) {
        this.dispatchService.behaviorSubjectDispatchGrid.next({
          reload: true,
          opened: false,
        });
      } else {
        this.confirmationService.open({
          title: 'Editar despacho',
          message:
            'El despacho no se pudo actualizar, favor intente nuevamente.',
          actions: {
            cancel: {
              label: 'Aceptar',
            },
            confirm: {
              show: false,
            },
          },
          icon: {
            show: true,
            name: 'heroicons_outline:exclamation',
            color: 'warn',
          },
        });
      }
    });

    // const dialogRef = this.matDialog.open(StartDispatchComponent, {
    //     width: '455px',
    //     data: this.dispatches,
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    //     if (res) {
    //     }
    // });
  }
  /**
   * @description: Finaliza un despacho
   */
  public finishDispatch(): void {
    this.dispatchForm.controls['status'].setValue(2);
    this.dispatchForm.controls['date_end_dispatch'].setValue(new Date());
    const data = this.dispatchForm.getRawValue();
    let confirmation = this.confirmationService.open({
      title: 'Finalizar despacho',
      message:
        '¿Está seguro de que desea finalizar este despacho? ¡Esta acción no se puede deshacer!',
      actions: {
        confirm: {
          label: 'Finalizar',
          color: 'accent',
        },
      },
      icon: {
        name: 'heroicons_outline:check-circle',
        color: 'info',
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.dispatchForm.disable();
        this.dispatchService.putDispatch(data).subscribe((res) => {
          this.dispatchForm.enable();
          if (res.code === 200) {
            this.dispatchService.behaviorSubjectDispatchGrid.next({
              reload: true,
              opened: false,
            });
            confirmation = this.confirmationService.open({
              title: 'Finalizar despacho',
              message: 'Despacho finalizado con exito!',
              actions: {
                cancel: {
                  label: 'Aceptar',
                },
                confirm: {
                  show: false,
                },
              },
              icon: {
                name: 'heroicons_outline:check-circle',
                color: 'success',
              },
            });
          } else {
            confirmation = this.confirmationService.open({
              title: 'Finalizar despacho',
              message:
                'El despacho no se pudo finalizar, favor intente nuevamente.',
              actions: {
                cancel: {
                  label: 'Aceptar',
                },
                confirm: {
                  show: false,
                },
              },
              icon: {
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
              },
            });
          }
        });
      }
    });
  }
  public searchGoogleApi(): any {
    if (this.dispatchForm.value.init_place) {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: this.dispatchForm.value.init_place,
        },
        (predictions: any, status: any) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          this.prediction = predictions;
        }
      );
    }
    if (this.dispatchForm.value.end_place) {
      const service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        {
          input: this.dispatchForm.value.end_place,
        },
        (predictions: any, status: any) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          this.prediction = predictions;
        }
      );
    }
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * @description: Inicializa el formulario de despachos
   */
  private createContactForm(): void {
    this.dispatchForm = this.fb.group({
      id: [''],
      spreadsheet: ['', [Validators.required]],
      client: ['', [Validators.required]],
      init_place: ['', [Validators.required]],
      end_place: ['', [Validators.required]],
      plate: ['', [Validators.required]],
      container_number: ['', [Validators.required]],
      detail: [''],
      owner_driver_id: [''],
      status: [0, [Validators.required]],
      security_seal: ['', [Validators.required]],
      device: ['', [Validators.required]],
      automatic_finish: [false],
      date_init_dispatch: [''],
      date_end_dispatch: [''],
      declaration_number: [''],
    });
  }
  /**
   * @description: Buscar los dispositivos aptos para crear un despacho
   */
  private getDevicesDispatch(): void {
    this.dispatchService.getDevicesDispatch().subscribe((res) => {
      this.devices = res.data;
    });
  }
  /**
   * @description: Buscar los dispositivos aptos para crear un despacho
   */
  private getDriver(): void {
    this.driverService.getDrivers().subscribe((res) => {
      this.drivers = res.data;
    });
  }
  /**
   * @description: Escucha el observable behavior y busca al despacho
   */
  private listenObservables(): void {
    this.subscription =
      this.dispatchService.behaviorSubjectDispatchForm.subscribe(
        ({ newDispatch, id, isEdit }) => {
          this.editMode = isEdit;
          if (newDispatch) {
            this.dispatches = [];
            this.dispatches['client'] = newDispatch;
            if (this.dispatchForm) {
              this.dispatchForm.reset();
            }
          }
          if (id) {
            this.dispatchService
              .getDispatch(id)
              .subscribe((res) => {
                this.dispatches = res.data;
                this.dispatchForm.patchValue(this.dispatches);
              });
          }
        }
      );
  }

  /**
   * @description: Editar un despacho
   */
  private editDispatch(data: any): void {
    this.dispatchForm.disable();
    const confirmation = this.confirmationService.open({
      title: 'Editar despacho',
      message:
        '¿Está seguro de que desea editar este despacho? ¡Esta acción no se puede deshacer!',
      actions: {
        confirm: {
          label: 'Editar',
          color: 'accent',
        },
      },
      icon: {
        name: 'heroicons_outline:pencil',
        color: 'info',
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.dispatchService.putDispatch(data).subscribe((res) => {
          this.dispatchForm.enable();
          if (res.code === 200) {
            this.dispatchService.behaviorSubjectDispatchGrid.next({
              reload: true,
              opened: false,
            });
            this.toastAlert.toasAlertSuccess({
              message: 'Despacho modificado con exito.',
            });
          } else {
            this.toastAlert.toasAlertWarn({
              message: 'El despacho no se pudo modificar, favor intente nuevamente.',
            });
          }
        });
      }
    });
  }
  /**
   * @description: Guarda un nuevo contacto
   */
  private newDispatch(data: any): void {
    this.dispatchForm.disable();
    this.dispatchService.postDispatch(data).subscribe((res) => {
      this.dispatchForm.enable();
      if (res.code === 200) {
        this.dispatchService.behaviorSubjectDispatchGrid.next({
          reload: true,
          opened: false,
        });
        this.toastAlert.toasAlertSuccess({
          message: 'Despacho creado con exito.',
        });
      } else {
        this.toastAlert.toasAlertWarn({
          message: 'El despacho no se pudo crear, favor intente nuevamente.',
        });
      }
    });
  }
}
