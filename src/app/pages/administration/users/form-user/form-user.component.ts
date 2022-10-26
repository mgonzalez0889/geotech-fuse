import {
  Component,
  EventEmitter, Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfilesService } from '../../../../core/services/profiles.service';
import { Observable, Subscription } from 'rxjs';
import { UsersService } from '../../../../core/services/users.service';
import { fuseAnimations } from '../../../../../@fuse/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseValidators } from '../../../../../@fuse/validators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FormUserComponent implements OnInit, OnDestroy {
  @Output() emitCloseForm = new EventEmitter<void>();
  public formUser: FormGroup;
  public profile$: Observable<any>;
  public subscription$: Subscription;
  public titleForm: string;
  public editPassword: boolean = false;
  public fieldPassword: boolean;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfilesService,
    private userService: UsersService,
    private _snackBar: MatSnackBar,


  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getProfile();
    this.listenObservables();
  }

  /**
   * @description: Metodo para guardar y editar usuario
   */
  public onSave(): void {
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

  /**
   * @description: Cierra formulario
   */
  public onClose(): void {
    // this.onShow.emit(false);
  }

  /**
   * @description: Definicion del formulario reactivo
   */
  private createForm(): void {
    this.formUser = this.fb.group({
      id: undefined,
      user_login: [''],
      password_digest: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
      encrypted_password: [''],
      full_name: [''],
      status: [true],
      owner_id: ['1'],
      user_profile_id: [''],
      email: [''],
      phone: [''],
      address: [''],
      enable_pass: ['']
    },
      {
        validators: FuseValidators.mustMatch('password_digest', 'confirm_password')
      }
    );
  }

  /**
   * @description: Trae todos los perfiles
   */
  private getProfile(): void {
    this.profile$ = this.profileService.getProfiles();
  }

  /**
   * @description: Crea un nuevo usuario
   */
  private newUser(data: any): void {
    this.subscription$ = this.userService.postUser(data).subscribe((res) => {
      this._snackBar.open('Se ha creado el nuevo usuario', 'CERRAR', { duration: 4000 });
    });
  }

  /**
   * @description: Edita un usuario
   **/
  private editUser(data: any): void {
    this.subscription$ = this.userService.putUser(data).subscribe((res) => {
      this._snackBar.open('Usuario actualizado con exito', 'CERRAR', { duration: 4000 });
    });
  }

  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
    this.subscription$ = this.userService.behaviorSubjectUser$.subscribe(({ type, isEdit, payload }) => {
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

  /**
   * @description: Destruye las subscripciones
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

}
