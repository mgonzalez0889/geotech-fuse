/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Inject, OnInit } from '@angular/core';
import { IconsModule } from '../../../../core/icons/icons.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlCenterService } from 'app/core/services/api/control-center.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-modal-contacts',
  templateUrl: './modal-contacts.component.html',
  styleUrls: ['./modal-contacts.component.scss'],
})
export class ModalContactsComponent implements OnInit {
  public contactForm: FormGroup;
  public typeContacts: any = [];
  public countries: any = [];
  public countrieFlag: { code: string; flagImagePos: string } = { code: '+57', flagImagePos: '' };
  private unsubscribe$ = new Subject<void>();


  constructor(
    public dialogRef: MatDialogRef<ModalContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public infoContact,
    private controlCenterService: ControlCenterService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private iconService: IconsModule,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.createContactForm();
    this.typeContact();
    this.readCountries();
  }
  /**
   * @description:Trae la informacion que pertenece el indicativo en el formulario
   */
  // getCountryByIso(code: string): any {
  //   if (code) {
  //     return this.countries.find(country => country.code === code);
  //   }
  // }
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
      identification: [''],
      address: [''],
      description: [''],
      indicative: ['+57', [Validators.required]],
    });
    console.log(this.infoContact);
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

  private readCountries(): void {
    this.iconService.getCountries()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.countries = res;
        const compareCode = this.contactForm.controls['indicative'].value;
        const countrieInit = this.countries.find(({ code }) => code === compareCode);
        this.countrieFlag = { ...countrieInit };
        console.log(this.countrieFlag);
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
              title: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContactEdit'),
              message: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContactEditSuccess'),

              icon: {
                name: 'heroicons_outline:check-circle',
                color: 'success',
              },
            });
          } else {
            this.confirmationService.open({
              title: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContactEdit'),
              message:
                this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContactEditError'),

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
            title: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContact'),
            message: this.translocoService.translate('monitoringCenter.alertMessage.messageAlertContactSuccess'),

            icon: {
              name: 'heroicons_outline:check-circle',
              color: 'success',
            },
          });
        } else {
          this.confirmationService.open({
            title: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContact'),
            message:
              this.translocoService.translate('monitoringCenter.alertMessage.messageAlertContactError'),

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
              title: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContact'),
              message: this.translocoService.translate('monitoringCenter.alertMessage.messageAlertContactSuccess'),

              icon: {
                name: 'heroicons_outline:check-circle',
                color: 'success',
              },
            });
          } else {
            this.confirmationService.open({
              title: this.translocoService.translate('monitoringCenter.alertMessage.titleMessageAlertContact'),
              message:
              this.translocoService.translate('monitoringCenter.alertMessage.messageAlertContactSuccess'),

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
