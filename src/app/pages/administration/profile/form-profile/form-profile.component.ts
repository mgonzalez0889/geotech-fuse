import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ProfilesService} from "../../../../core/services/profiles.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {HelperService} from "../../../../core/services/helper.service";
import {DialogAlertEnum} from "../../../../core/interfaces/fuse-confirmation-config";

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss']
})
export class FormProfileComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public subscription$: Subscription;
  @Output() onShow: EventEmitter<string> = new EventEmitter<string>();
  public tabOptionOne;
  public tabOptionTwo = false;
  public tabSelected: number;
  public titleForm: string;
  constructor(
      private fb: FormBuilder,
      private profileService: ProfilesService,
      private _snackBar: MatSnackBar,
      private _helperService: HelperService
  ) { }

    ngOnDestroy(): void {
        // this.subscription$.unsubscribe();
    }

  ngOnInit(): void {
      this.createForm();
      this.listenObservables();
  }
  /**
   * @description: Metodo para guardar o editar informacion
   */
  public onSave(): void {
      const data = this.form.getRawValue();

      if (!data.id) {
          this._helperService.showDialogAlertOption({
              title: 'Guardar datos',
              text: '¿Desea crear un nuevo perfil?',
              type: DialogAlertEnum.question,
              showCancelButton: true,
              textCancelButton: 'No',
              textConfirButton: 'Si'
          }).then(
              (result) => {
                  if (result.value) {
                      this.createProfile(data);
                  }
              }
          );
      }else {
          this._helperService.showDialogAlertOption({
              title: 'Guardar datos',
              text: '¿Desea editar el perfil?',
              type: DialogAlertEnum.question,
              showCancelButton: true,
              textCancelButton: 'No',
              textConfirButton: 'Si'
          }).then(
              (result) => {
                  this.editProfile(data);
              }
          );
      }
  }
  /**
   * @description: Cierra el formulario
   */
  public onClose(): void {
      this.onShow.emit('PROFILES');
  }
  /**
   * @description: Metodo para cambio de tab
   */
  public onChangeTabs(event: MatTabChangeEvent): void {
      this.tabSelected = event.index;
  }
  /**
   * @description: Creacion de formulario
   */
  private createForm(): void {
      this.form = this.fb.group({
          id: undefined,
          name: [''],
          description: [''],
          status: [true]
      });
  }
  /**
   * @description: Crea un nuevo perfil
   */
  private createProfile(data: any): void {
      this.subscription$ = this.profileService.postProfile(data).subscribe(() => {
          this._snackBar.open('Perfil creado con exito', '', {duration: 4000});
          this.tabOptionOne = true;
          this.tabSelected = 1;
          this.onShow.emit('PROFILES');
      });
  }
  /**
   * @description: Edicion del perfil
   */
  private editProfile(data: any): void {
      this.subscription$ = this.profileService.putProfile(data).subscribe(() => {
          this._snackBar.open('Perfil actualizado con exito', '', {duration: 4000});
          this.onShow.emit('PROFILES');
      });
  }
  /**
   * @description: Escucha el observable behavior
   */
  private listenObservables(): void {
      this.subscription$ = this.profileService.behaviorSubjectProfile$.subscribe(({type, isEdit, payload}) => {
          if (isEdit && type == 'EDIT') {
              this.form.patchValue(payload);
              this.tabOptionOne = isEdit;
              this.titleForm = `Editar perfil ${payload.name}` ;
          }else if (!isEdit && type == 'NEW') {
              this.form.reset({
                  status: [true]
              });
              this.titleForm = 'Nuevo perfil';
          }
      });
  }

}
