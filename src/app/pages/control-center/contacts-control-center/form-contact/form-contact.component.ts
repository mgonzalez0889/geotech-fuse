/* eslint-disable @typescript-eslint/naming-convention */
import { Subscription } from 'rxjs';
import { NgxPermissionsObject } from 'ngx-permissions';
import { AuthService } from 'app/core/auth/auth.service';
import { IconsModule } from 'app/core/icons/icons.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlCenterService } from 'app/core/services/api/control-center.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent implements OnInit, OnDestroy {
  public contacts: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public contactForm: FormGroup;
  public subscription: Subscription;
  public typeContacts: any = [];
  public countries: any = [];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    addContactControl: 'centro_de_monitoreo:contacto_centro_de_control:create',
    updateContactControl: 'centro_de_monitoreo:contacto_centro_de_control:update',
    deleteContactControl: 'centro_de_monitoreo:contacto_centro_de_control:delete',
  };
  constructor(
    private controlCenterService: ControlCenterService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private iconService: IconsModule,
    private authService: AuthService,
    private toastAlert: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.createContactForm();
    this.listenObservables();
    this.typeContact();
    this.iconService.getCountries().subscribe((res) => {
      this.countries = res;
    });
    this.authService.permissionList.subscribe((permission) => {
      this.listPermission = permission;
    });
  }

  /**
   * @description: Valida si es edita o guarda un contacto nuevo
   */
  public onSave(): void {
    const data = this.contactForm.getRawValue();
    if (!data.id) {
      this.newContact(data);
    } else {
      if (!this.listPermission[this.permissionValid.updateContactControl]) {
        this.toastAlert.toasAlertWarn({
          message: 'No tienes permisos suficientes para realizar esta acción.',
        });
        return;
      }
      this.editContact(data);
    }
  }
  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.controlCenterService.behaviorSubjectContactGrid.next({
      opened: false,
      reload: false,
    });
  }

  /**
   * @description: Elimina el contacto
   */
  public deleteContact(id: number): void {
    if (!this.listPermission[this.permissionValid.deleteContactControl]) {
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }
    const confirmation = this.confirmationService.open({
      title: 'Eliminar contacto',
      message:
        '¿Está seguro de que desea eliminar este contacto? ¡Esta acción no se puede deshacer!',
      actions: {
        confirm: {
          label: 'Eliminar',
        },
      },
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.controlCenterService
          .deleteContacts(id)
          .subscribe((res) => {
            if (res.code === 200) {
              this.controlCenterService.behaviorSubjectContactGrid.next(
                {
                  reload: true,
                  opened: false,
                }
              );
              this.toastAlert.toasAlertSuccess({
                message: 'Contacto eliminado con exito!',

              });
            } else {
              this.toastAlert.toasAlertWarn({
                message:
                  'El contacto no se pudo eliminar, favor intente nuevamente.',
              });
            }
          });
      }
    });
  }
  /**
   * @description:Trae la informacion que pertenece el indicativo en el formulario
   */
  public getCountryByIso(code: string): any {
    if (code) {
      return this.countries.find(country => country.code === code);
    }
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * @description: Trae los tipos de contacto
   */
  private typeContact(): void {
    this.controlCenterService
      .getTypeContactsControlCenter()
      .subscribe((res) => {
        this.typeContacts = res.data;
      });
  }
  /**
   * @description: Inicializa el formulario de contactos
   */
  private createContactForm(): void {
    this.contactForm = this.fb.group({
      id: [''],
      owner_id: [''],
      type_contact_id: [1, [Validators.required]],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: [''],
      indicative: ['+57', [Validators.required]],
    });
  }
  /**
   * @description: Escucha el observable behavior y busca al contacto
   */
  private listenObservables(): void {
    this.subscription =
      this.controlCenterService.behaviorSubjectContactForm.subscribe(
        ({ newContact, id, isEdit, ownerId }) => {
          this.editMode = isEdit;
          if (newContact) {
            this.contacts = [];
            // this.contacts['full_name'] = newContact;
            if (this.contactForm) {
              this.contactForm.reset();
              this.contactForm.controls['indicative'].setValue(
                '+57'
              );
            }
          }
          this.contactForm.patchValue({
            owner_id: ownerId,
          });
          if (id) {
            this.controlCenterService
              .getContact(id)
              .subscribe((data) => {
                this.contacts = data.data;
                this.contactForm.patchValue(this.contacts);
              });
          }
        }
      );
  }
  /**
   * @description: Editar un contacto
   */
  private editContact(data: any): void {
    let confirmation = this.confirmationService.open({
      title: 'Editar contacto',
      message:
        '¿Está seguro de que desea editar este contacto? ¡Esta acción no se puede deshacer!',
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
        this.controlCenterService.putContacts(data).subscribe((res) => {
          if (res.code === 200) {
            this.controlCenterService.behaviorSubjectContactGrid.next(
              {
                reload: true,
                opened: false,
              }
            );
            confirmation = this.confirmationService.open({
              title: 'Editar contacto',
              message: 'Contacto editado con exito!',
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
              title: 'Editar contacto',
              message:
                'El contacto no se pudo actualizar, favor intente nuevamente.',
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
  /**
   * @description: Guarda un nuevo contacto
   */
  private newContact(data: any): void {
    this.controlCenterService.postContacts(data).subscribe((res) => {
      if (res.code === 200) {
        this.controlCenterService.behaviorSubjectContactGrid.next({
          reload: true,
          opened: false,
        });
        const confirmation = this.confirmationService.open({
          title: 'Crear contacto',
          message: 'Contacto creado con exito!',
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
        const confirmation = this.confirmationService.open({
          title: 'Crear contacto',
          message:
            'El contacto no se pudo crear, favor intente nuevamente.',
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
}
