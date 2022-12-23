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
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { IconsModule } from 'app/core/icons/icons.module';
import { FuseValidators } from '../../../../../@fuse/validators';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilesService } from '@services/api/profiles.service';
import { UsersService } from '@services/api/users.service';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
  animations: fuseAnimations
})
export class FormUserComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataUpdate: any = null;
  @Input() titleForm: string = '';
  @Output() emitCloseForm = new EventEmitter<void>();
  public formUser: FormGroup = this.fb.group({});
  public hidePassword: boolean = false;
  public hidePasswordConfirm: boolean = false;
  public editMode: boolean = false;
  public countries: any[] = [];
  public countrieFlag: { code: string; flagImagePos: string } = { code: '+57', flagImagePos: '' };
  public profile$: Observable<any>;
  public validUsername: boolean = false;
  public editPassword: boolean = false;
  public userId: number;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private profileService: ProfilesService,
    private userService: UsersService,
    private iconService: IconsModule
  ) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeControlsForm();
  }

  ngOnInit(): void {
    this.profile$ = this.profileService.getProfiles().pipe(
      takeUntil(this.unsubscribe$),
      map(({ data }) =>
        data?.map(values => ({
          ...values.profile,
          plates: values.plate,
          fleets: values.fleets,
          modules: values.modules
        }))
      ),
    );
    this.validateUsernameRepeat();
    this.readCountries();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public get valueControlChangePassword(): boolean {
    return this.formUser.get('change_password')?.value;
  }

  public get errorMustMatch(): boolean {
    return this.formUser.get('confirm_password').hasError('mustMatch');
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
    this.iconService.getCountries()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.countries = res;
        const compareCode = this.formUser.controls['indicative'].value;
        const countrieInit = this.countries.find(({ code }) => code === compareCode);
        this.countrieFlag = { ...countrieInit };
      });
  }

  /**
   * @description: se hacen cambion en los controles del formulario
   */
  private changeControlsForm(): void {
    if (this.dataUpdate) {
      this.userId = JSON.parse(localStorage.getItem('infoUser')).id;
      if (this.userId === this.dataUpdate.id) {
        this.formUser.get('user_profile_id').disable();
      } else {
        this.formUser.get('user_profile_id').enable();
      }
      this.formUser.addControl('change_password', this.fb.control(false));
      this.formUser.controls['password_digest'].clearValidators();
      this.formUser.controls['confirm_password'].clearValidators();
      this.editMode = false;
      this.formUser.patchValue({ ...this.dataUpdate });
    } else {
      this.formUser.controls['password_digest'].setValidators([Validators.required]);
      this.formUser.controls['confirm_password'].setValidators([Validators.required]);
      this.formUser.reset();
      this.formUser.controls['indicative'].setValue('+57');
      this.editMode = false;
    }
    this.formUser.controls['password_digest'].updateValueAndValidity();
    this.formUser.controls['confirm_password'].updateValueAndValidity();

    this.formUser.controls['indicative'].valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        const countrieInit = this.countries.find(({ code }) => code === data);
        this.countrieFlag = { ...countrieInit };
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
      user_profile_id: ['',],
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

    this.changeControlsForm();
  }

  /**
   * @description: se verifica si ya existe el nombre de usuario
   */
  private validateUsernameRepeat(): void {
    const usernameControl = this.formUser.controls['user_login'];
    usernameControl.valueChanges.pipe(
      mergeMap(valueControl => this.userService.validUsername(valueControl)),
      takeUntil(this.unsubscribe$)
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
