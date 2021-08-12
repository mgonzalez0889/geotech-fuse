import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProfilesService} from "../../../../core/services/profiles.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss']
})
export class FormProfileComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public subscription$: Subscription;
  constructor(
      private fb: FormBuilder,
      private profileService: ProfilesService,
      private _snackBar: MatSnackBar
  ) { }

    ngOnDestroy(): void {
        throw new Error('Method not implemented.');
    }

  ngOnInit(): void {
      this.createForm();
  }

  public onSave(): void {
      const data = this.form.getRawValue();
      if (!data.id) {
          this.createProfile(data);
      }else {
          this.editProfile(data);
      }
  }
  /**
   * @description: Creacion de formulario
   */
  private createForm(): void {
      this.form = this.fb.group({
          id: undefined,
          name: [''],
          description: [''],
          status: ['']
      });
  }
  /**
   * @description: Crea un nuevo perfil
   */
  private createProfile(data: any): void {
      this.subscription$ = this.profileService.postProfile(data).subscribe(() => {
          this._snackBar.open('Perfil creado con exito', 'CERRAR', {duration: 4000});
      });
  }
  /**
   * @description: Edicion del perfil
   */
  private editProfile(data: any): void {
      this.subscription$ = this.profileService.putProfile(data).subscribe(() => {
          this._snackBar.open('Perfil creado con exito', 'CERRAR', {duration: 4000});
      });
  }

}
