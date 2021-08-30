import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {MenuOptionsService} from "../../../../core/services/menu-options.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form-menu-options',
  templateUrl: './form-menu-options.component.html',
  styleUrls: ['./form-menu-options.component.scss']
})
export class FormMenuOptionsComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public subscription$: Subscription;
  @Output() onShow: EventEmitter<boolean> = new EventEmitter<boolean>();
  public titleForm: string;
  public menuOptions$: Observable<any>;
  constructor(
      private fb: FormBuilder,
      private optionServices: MenuOptionsService,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.createForm();
      this.listenObservables();
      this.getMenuOptionsFather();
  }
  /**
   * @description: Metodo para guardar y editar opciones
   */
  public onSave(): void {
      const data = this.form.getRawValue();
      if (!data.id) {
          this.createOption(data);
      }else {
          this.editOption(data);
      }
  }
  /**
   * @description: Cierra el formulario
   */
  public onCLose(): void {
      this.onShow.emit(false);
  }
  /**
   * @description: Definicion del formulario reactivo
   */
  private createForm(): void {
      this.form = this.fb.group({
          id: undefined,
          title: [''],
          option_description: [''],
          icon: [''],
          option_ubication: [''],
          option_read: [''],
          option_create: [''],
          option_update: [''],
          option_delete: [''],
          id_father: ['']
      });
  }
  /**
   * @description: Crea una nueva opcion
   */
  private createOption(data: any): void {
      this.subscription$ = this.optionServices.postMenuOption(data).subscribe(() => {
          this._snackBar.open('Opcion creada con exito', 'CERRAR', {duration: 4000});
          this.onShow.emit(false);
      });
  }
  /**
   * @description: Edita una opcion
   */
  private editOption(data: any): void {
      this.subscription$ = this.optionServices.putMenuOption(data).subscribe(() => {
          this._snackBar.open('Opcion actualizada con exito', 'CERRAR', {duration: 4000});
          this.onShow.emit(false);
      });
  }
  /**
   * @description: Escucha de los observables
   */
  private listenObservables(): void {
      this.subscription$ = this.optionServices.behaviorSubjectOption$.subscribe(({type, isEdit, payload}) => {
        if (isEdit && type == 'EDIT') {
            this.form.patchValue(payload);
            this.titleForm = 'Editar opción';
        }else if (!isEdit && type == 'NEW'){
            this.form.reset({
                id: undefined,
            });
        }
      });
  }
  /**
   * @description: Obtiene todos los menu options
   */
  private getMenuOptionsFather(): void {
      this.menuOptions$ = this.optionServices.getMenuOptions();
  }
    /**
     * @description: Elimina los observables
     */
    ngOnDestroy(): void {
      this.subscription$.unsubscribe();
    }
}
