/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { ContactService } from 'app/core/services/contact.service';
import { IconService } from 'app/core/services/icons/icon.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subscription } from 'rxjs';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';


@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
})
export class FormContactComponent implements OnInit, OnDestroy {
  public contacts: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public countries: any = [];
  public contactForm: FormGroup;
  public subscription: Subscription;
  public listPermission: any = [];
  private permissionValid: { [key: string]: string } = {
    addContacto: 'administracion:contactos:create',
    updateContacto: 'administracion:contactos:update',
    deleteContacto: 'administracion:contactos:delete',
  };
  constructor(
    private contactService: ContactService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private iconService: IconService,
    private permissionsService: NgxPermissionsService,
    private toastAlert: ToastAlertService,
  ) { }

  ngOnInit(): void {
    this.iconService.getCountries().subscribe((res) => {
      this.countries = res;
    });
    this.listenObservables();
    this.createContactForm();
    this.subscription = this.permissionsService.permissions$
      .subscribe((data) => {
        this.listPermission = data ?? [];
      });
    // this.iconService.countries$
    //     .pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe((codes: Country[]) => {
    //         this.countries = codes;

    //         // Mark for check
    //         this._changeDetectorRef.markForCheck();
    //     });
  }
  getCountryByIso(code: string): any {
    if (code) {
      return this.countries.find((country) => country.code === code);
    }
  }

  /**
   * @description: Valida si es edita o guarda un contacto nuevo
   */
  public onSave(): void {
    const data = this.contactForm.getRawValue();
    if (!data.id) {
      this.newContact(data);
    } else {
      if (!this.listPermission[this.permissionValid.updateContacto]) {
        this.toastAlert.toasAlertWarn({
          message: 'No tienes permisos suficientes para realizar esta acción.',
        });
      } else {
        this.editContact(data);
      }
    }
  }
  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.contactService.behaviorSubjectContactGrid.next({
      opened: false,
      reload: false,
    });
  }
  /**
   * @description: Elimina el contacto
   */
  public deleteContact(id: number): void {
    if (!this.listPermission[this.permissionValid.deleteContacto]) {
      this.toastAlert.toasAlertWarn({
        message: 'No tienes permisos suficientes para realizar esta acción.',
      });

      return;
    }
    let confirmation = this.confirmationService.open({
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
        this.contactService.deleteContacts(id).subscribe((res) => {
          if (res.code === 200) {
            this.contactService.behaviorSubjectContactGrid.next({
              reload: true,
              opened: false,
            });
            confirmation = this.confirmationService.open({
              title: 'Eliminar contacto',
              message: 'Contacto eliminado con exito!',
              actions: {
                cancel: {
                  label: 'Aceptar',
                },
                confirm: {
                  show: false,
                },
              },
              icon: {
                name: 'heroicons_outline:exclamation',
                color: 'warn',
              },
            });
          } else {
            confirmation = this.confirmationService.open({
              title: 'Eliminar contacto',
              message:
                'El contacto no se pudo eliminar, favor intente nuevamente.',
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
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  /**
   * @description: Inicializa el formulario de contactos
   */
  private createContactForm(): void {
    this.contactForm = this.fb.group({
      id: [''],
      full_name: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      indicative: ['+57', [Validators.required]],
    });
  }
  /**
   * @description: Escucha el observable behavior y busca al contacto
   */
  private listenObservables(): void {
    this.subscription =
      this.contactService.behaviorSubjectContactForm.subscribe(
        ({ newContact, id, isEdit }) => {
          this.editMode = isEdit;
          if (newContact) {
            this.contacts = [];
            this.contacts['full_name'] = newContact;
            if (this.contactForm) {
              this.contactForm.reset();
              this.contactForm.controls['indicative'].setValue(
                '+57'
              );
            }
          }
          if (id) {
            this.contactService.getContact(id).subscribe((data) => {
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
    this.contactForm.disable();
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
        this.contactService.putContacts(data).subscribe((res) => {
          this.contactForm.enable();
          if (res.code === 200) {
            this.contactService.behaviorSubjectContactGrid.next({
              reload: true,
              opened: false,
            });
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
    this.contactForm.disable();
    this.contactService.postContacts(data).subscribe((res) => {
      this.contactForm.enable();
      if (res.code === 200) {
        this.contactService.behaviorSubjectContactGrid.next({
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
