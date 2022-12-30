import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IconsModule } from '../../../../core/icons/icons.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '@services/api/contact.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { TranslocoService } from '@ngneat/transloco';

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
    this.createContactForm();
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
   * @description: Valida si es edita o guarda un contacto nuevo
   */
  public onSave(): void {
    const data = this.contactForm.getRawValue();
    if (!data.id) {
      this.newContact(data);
    } else {
      if (!this.listPermission[this.permissionValid.updateContacto]) {
        this.toastAlert.toasAlertWarn({
          message:
            'messageAlert.messagePermissionWarn',
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
        message:
          'messageAlert.messagePermissionWarn',
      });

      return;
    }
    const confirmation = this.confirmationService.open({
      title: this.translocoService.translate('contacts.messageAlert.deleteContact'),
      message:
        this.translocoService.translate('contacts.messageAlert.deleteContactMessage'),
    });
    confirmation.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.contactService.deleteContacts(id).subscribe((res) => {
          if (res.code === 200) {
            this.contactService.behaviorSubjectContactGrid.next({
              reload: true,
              opened: false,
            });
            this.toastAlert.toasAlertSuccess({
              message: 'contacts.messageAlert.deleteSuccess'
            });
          } else {
            this.toastAlert.toasAlertWarn({
              message: 'contacts.messageAlert.deleteFailure'
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
      identification: [''],
      address: [''],
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
            if (this.contactForm) {
              this.contactForm.reset();
              this.contactForm.controls['indicative'].setValue(
                '+57'
              );
            }
          }
          if (id) {
            this.contactService.getContact(id).subscribe((data) => {
              console.log('data', data);
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
    const confirmation = this.confirmationService.open({
      title: this.translocoService.translate('contacts.messageAlert.editContact'),
      message:
        this.translocoService.translate('contacts.messageAlert.editContactMessage'),
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
            this.toastAlert.toasAlertSuccess({
              message: 'contacts.messageAlert.editSuccess'
            });
          } else {
            this.toastAlert.toasAlertWarn({
              message: 'contacts.messageAlert.editFailure'
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
        this.toastAlert.toasAlertSuccess({
          message: 'contacts.messageAlert.addSuccess'
        });
      } else {
        this.toastAlert.toasAlertWarn({
          message: 'contacts.messageAlert.addFailure'
        });
      }
    });
  }
}
