/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilesService } from '../../../../core/services/api/profiles.service';
import { Observable, Subject } from 'rxjs';
import { UsersService } from '../../../../core/services/users.service';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { FuseValidators } from '../../../../../@fuse/validators';
import { IconService } from 'app/core/services/icons/icon.service';
import { mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FormUserComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataUpdate: any = null;
  @Input() titleForm: string = '';
  @Output() emitCloseForm = new EventEmitter<void>();
  public formUser: FormGroup = this.fb.group({});
  public hidePassword: boolean = false;
  public editMode: boolean = false;
  public countries: any[] = [];
  public countrieFlagInit: string = '';
  public profile$: Observable<any>;
  public validUsername: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private profileService: ProfilesService,
    private userService: UsersService,
    private iconService: IconService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataUpdate) {
      this.editMode = false;
      this.formUser?.controls['password_digest']?.clearValidators();
      this.formUser?.controls['confirm_password']?.clearValidators();
      this.formUser?.patchValue({ ...this.dataUpdate });
    } else {
      this.editMode = false;
      this.formUser?.controls['password_digest']?.setValidators([Validators.required]);
      this.formUser?.controls['confirm_password']?.setValidators([Validators.required]);
      this.formUser.reset();
    }
    this.formUser?.controls['password_digest']?.updateValueAndValidity();
    this.formUser?.controls['confirm_password']?.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.profile$ = this.profileService.getProfiles();
    this.buildForm();
    this.validateUsernameRepeat();
    this.readCountries();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Se recoge la informacion del formulario y si hay data de modificarcion se emite la accion de editar sino la accion de agregar
   */
  public onSubmit(): void {
    if (!this.formUser.valid) {
      return;
    }

    const userDataForm = this.formUser.value;

    if (!this.dataUpdate) {
      delete userDataForm.confirm_password;
      this.userService.userForm$.next({ typeAction: 'add', formData: userDataForm });
    } else {
      this.userService.userForm$.next({ typeAction: 'edit', formData: { ...userDataForm, id: this.dataUpdate.id } });
    }


    this.formUser.reset();
    this.editMode = false;
  }

  /**
   * @description: Se emite el tipo de accion y el registro a eliminar
   */
  public deleteUser(): void {
    this.userService.userForm$.next({ typeAction: 'delete', formData: this.dataUpdate });
    this.editMode = false;
  }

  /**
   * @description: Aciones cuando se cierre el formulario
   */
  public closeForm(): void {
    this.emitCloseForm.emit();
    this.editMode = false;
    this.dataUpdate = null;
    this.formUser.reset();
  }

  /**
   * @description: Lectura de la informacion de cudiades y codigos y se pinta en el select de telefono
   */
  private readCountries(): void {
    this.iconService.getCountries().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.countries = res;
      const compareCode = this.formUser?.controls['indicative'].value || '+57';
      const countrieInit = this.countries.find(({ code }) => code === compareCode);
      this.countrieFlagInit = countrieInit.flagImagePos;
    });
  }

  /**
   * @description: Definicion del formulario reactivo
   */
  private buildForm(): void {
    this.formUser = this.fb.group({
      user_login: ['', [Validators.required]],
      password_digest: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      user_profile_id: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      indicative: ['+57', [Validators.required]],
      full_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: [''],
    },
      {
        validators: FuseValidators.mustMatch('password_digest', 'confirm_password')
      }
    );

    if (this.dataUpdate) {
      this.formUser?.controls['password_digest'].clearValidators();
      this.formUser?.controls['confirm_password'].clearValidators();
      this.formUser?.patchValue({ ...this.dataUpdate });
    } else {
      this.formUser?.controls['password_digest'].setValidators([Validators.required]);
      this.formUser?.controls['confirm_password'].setValidators([Validators.required]);
    }
    this.formUser?.controls['password_digest'].updateValueAndValidity();
    this.formUser?.controls['confirm_password'].updateValueAndValidity();

  }

  /**
   * @description: se verifica si ya existe el nombre de usuario
   */
  private validateUsernameRepeat(): void {
    const usernameControl = this.formUser.controls['user_login'];
    usernameControl.valueChanges.pipe(
      mergeMap(valueControl => this.userService.validUsername(valueControl))
    ).subscribe(({ message }) => {
      if (message === 'User No Exists' || this.dataUpdate) {
        if (usernameControl.hasError('existUsername')) {
          delete usernameControl.errors.existUsername;
          usernameControl.updateValueAndValidity();
        }
        this.validUsername = false;
      } else {
        usernameControl.setErrors({ existUsername: true });
        usernameControl.markAsTouched();
        this.validUsername = true;
      }
    });

  }

}
