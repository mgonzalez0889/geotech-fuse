import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfilesService} from '../../../../core/services/profiles.service';
import {Observable, Subscription} from 'rxjs';
import {UsersService} from '../../../../core/services/users.service';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseValidators} from "../../../../../@fuse/validators";

@Component({
    selector: 'app-form-user',
    templateUrl: './form-user.component.html',
    styleUrls: ['./form-user.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FormUserComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public profile$: Observable<any>;
    public subscription$: Subscription;
    @Output() onShow: EventEmitter<boolean> = new EventEmitter<boolean>();
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
        const data = this.form.getRawValue();
        if (!data.id) {
            this.newUser(data);
        } else {
            this.editUser(data);
        }
    }

    /**
     * @description: Cierra formulario
     */
    public onClose(): void {
        this.onShow.emit(false);
    }

    /**
     * @description: Definicion del formulario reactivo
     */
    private createForm(): void {
        this.form = this.fb.group({
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
            this._snackBar.open('Se ha creado el nuevo usuario', 'CERRAR', {duration: 4000});
            this.onShow.emit(false);
            console.log(res.data);
        });
    }

    /**
     * @description: Edita un usuario
     **/
    private editUser(data: any): void {
        this.subscription$ = this.userService.putUser(data).subscribe((res) => {
            this._snackBar.open('Usuario actualizado con exito', 'CERRAR', {duration: 4000});
            this.onShow.emit(false);
        });
    }

    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription$ = this.userService.behaviorSubjectUser$.subscribe(({type, isEdit, payload}) => {
            if (isEdit && type == 'EDIT') {
                this.form.patchValue(payload);
                this.titleForm = 'Editar usuario';
                this.editPassword = true;
                this.fieldPassword = false;
            } else if (!isEdit && type == 'NEW') {
                this.form.reset({
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
