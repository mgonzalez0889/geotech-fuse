/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilesService } from '../../../../core/services/profiles.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { UsersService } from '../../../../core/services/users.service';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseValidators } from '../../../../../@fuse/validators';
import { IconService } from 'app/core/services/icons/icon.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
  // encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FormUserComponent implements OnInit, OnDestroy {
  @Input() listUsers: any[] = [];
  @Output() emitCloseForm = new EventEmitter<void>();
  public formUser: FormGroup;
  public editPassword: boolean = false;
  public hidePassword: boolean = false;
  public fieldPassword: boolean;
  public editMode: boolean = false;
  public countries: any = [];
  public titleForm: string = '';
  public profile$: Observable<any>;
  public validUsername: boolean = false;
  private unsubscribe$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private profileService: ProfilesService,
    private userService: UsersService,
    private _snackBar: MatSnackBar,
    private iconService: IconService
  ) { }

  ngOnInit(): void {
    this.iconService.getCountries().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.countries = res;

    });

    this.profile$ = this.profileService.getProfiles();

    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {
    if (this.formUser.valid) {
      const data = this.formUser.getRawValue();
      if (!data.id) {
        this.newUser(data);
      } else {
        this.editUser(data);
      }
    } else {
      this.formUser.markAllAsTouched();
    }
  }

  getCountryByIso(code: string): any {
    if (code) {
      return this.countries.find((country) => country.code === code);
    }
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
      status: [true],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    },
      {
        validators: FuseValidators.mustMatch('password_digest', 'confirm_password')
      }
    );

    this.formUser.controls['user_login'].valueChanges.subscribe((data: any) => {
      console.log(data);

      this.validUsername = this.listUsers.some(({ user_login }) => user_login === data);
      console.log(this.validUsername);
      // if (this.validUsername) {
      //   this.formUser.controls['user_login;

      // }

    });
  }


  /**
   * @description: Crea un nuevo usuario
   */
  private newUser(data: any): void {
    this.userService.postUser(data).subscribe((res) => {
      this._snackBar.open('Se ha creado el nuevo usuario', 'CERRAR', { duration: 4000 });
    });
  }

  /**
   * @description: Edita un usuario
   **/
  private editUser(data: any): void {
    this.userService.putUser(data).subscribe((res) => {
      this._snackBar.open('Usuario actualizado con exito', 'CERRAR', { duration: 4000 });
    });
  }

  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.userService.behaviorSubjectUser$.subscribe(({ type, isEdit, payload }) => {
      if (isEdit && type == 'EDIT') {
        this.formUser.patchValue(payload);
        this.titleForm = `Editar usuario ${payload.user_login}`;
        this.editPassword = true;
        this.fieldPassword = false;
      } else if (!isEdit && type == 'NEW') {
        this.formUser.reset({
          user_login: [''],
          password_digest: [''],
          encrypted_password: [''],
          full_name: [''],
          status: [true],
          owner_id: ['1'],
          user_profile_id: [''],
          email: [''],
          phone: [''],
          address: ['']
        });
        this.titleForm = 'Nuevo usuario';
        this.fieldPassword = !isEdit;
      }
    });
  }


}
