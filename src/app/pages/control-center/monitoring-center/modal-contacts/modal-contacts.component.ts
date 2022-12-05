/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { IconsModule } from '../../../../core/icons/icons.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlCenterService } from 'app/core/services/api/control-center.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';

@Component({
  selector: 'app-modal-contacts',
  templateUrl: './modal-contacts.component.html',
  styleUrls: ['./modal-contacts.component.scss'],
})
export class ModalContactsComponent implements OnInit {
  public contactForm: FormGroup;
  public typeContacts: any = [];
  public countries: any = [];

  constructor(
    public dialogRef: MatDialogRef<ModalContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public infoContact,
    private controlCenterService: ControlCenterService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private iconService: IconsModule
  ) { }

  ngOnInit(): void {
    this.createContactForm();
    this.typeContact();
    this.iconService.getCountries().subscribe((res) => {
      this.countries = res;
    });
  }
  /**
   * @description:Trae la informacion que pertenece el indicativo en el formulario
   */
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
      this.editContact(data);
    }
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
    if (this.infoContact.id) {
      if (this.infoContact.owner_id_simulator === 1) {
        this.controlCenterService
          .getContact(this.infoContact.id)
          .subscribe((res) => {
            this.contactForm.patchValue(res.data);
          });
      } else {
        this.controlCenterService
          .getContactOwner(this.infoContact.id)
          .subscribe((res) => {
            this.contactForm.patchValue(res.data);
          });
      }
    }
    this.contactForm.patchValue({
      owner_id: this.infoContact.owner_id,
    });
  }
  /**
   * @description: Editar un contacto
   */
  private editContact(data: any): void {
    if (this.infoContact.owner_id_simulator === 1) {
      this.controlCenterService.putContacts(data).subscribe((res) => {
        if (res.code === 200) {
          this.confirmationService.open({
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
          this.confirmationService.open({
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
    } else {
      this.controlCenterService
        .putContactsOwner(data)
        .subscribe((res) => {
          if (res.code === 200) {
            this.confirmationService.open({
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
            this.confirmationService.open({
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
  }
  /**
   * @description: Guarda un nuevo contacto
   */
  private newContact(data: any): void {
    if (this.infoContact.owner_id_simulator === 1) {
      this.controlCenterService.postContacts(data).subscribe((res) => {
        if (res.code === 200) {
          this.confirmationService.open({
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
          this.confirmationService.open({
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
    } else {
      this.controlCenterService
        .postContactsOwner(data)
        .subscribe((res) => {
          if (res.code === 200) {
            this.confirmationService.open({
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
            this.confirmationService.open({
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
}
