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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatRadioChange } from '@angular/material/radio';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IListModules, IOptionPermission } from '@interface/index';
import { ProfilesService } from '@services/api/profiles.service';
import { FleetsService } from '@services/api/fleets.service';
import { MobileService } from '@services/api/mobile.service';
import { MenuOptionsService } from '@services/api/menu-options.service';

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss'],
})
export class FormProfileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataUpdate: any = null;
  @Input() titleForm: string = '';
  @Output() emitCloseForm = new EventEmitter<void>();
  public profiles: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public profileForm: FormGroup = this.fb.group({});
  public plates: any[] = [];
  public fleets: any[] = [];
  public availableModules: IListModules[] = [];
  public assignedModules: IListModules[] = [];
  public panelOpenState = false;
  public selectTrasport: 'mobiles' | 'fleet' = 'mobiles';
  public listTrasport: { name: string; text: string }[] = [
    {
      name: 'mobiles',
      text: 'profile.formPage.optionVehiculo',
    },
    {
      name: 'fleet',
      text: 'profile.formPage.optionFleets',
    },
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private profileService: ProfilesService,
    private fb: FormBuilder,
    private fleetsService: FleetsService,
    private menuOptionsService: MenuOptionsService,
    private mobilesService: MobileService,
  ) {
    this.buildForm();
  }

  /**
   * @description: se llaman todos los servicios y se crea el formulario reactivo.
   */
  ngOnInit(): void {
    this.mobilesService.selectState(state => state.mobiles)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.plates = data;
      });

    this.fleetsService.selectState(state => state.fleets)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.fleets = res;
      });

    this.readAndParseOptionModules();
  }

  /**
   * @description: si viene informacion para modificar, seteamos el formulario o lo limpiamos.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataUpdate) {
      const typeVehicle = this.dataUpdate.fleets.length ? 'fleet' : 'mobiles';
      this.onChangeTrasport({ value: typeVehicle } as MatRadioChange);

      this.assignedModules = [...this.dataUpdate.modules];
      this.profileForm.patchValue({ ...this.dataUpdate });

      setTimeout(() => {
        this.parseModuleUpdate();
      }, 1000);
    } else {
      this.assignedModules = [];
      this.profileForm.reset();
    }
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: cuando se envie el formulario, parseamos y preguntamos si va a modificar o agregar.
   */
  public onSubmit(): void {
    const modules: FormArray = this.profileForm.get('module') as FormArray;
    this.assignedModules.forEach(({ id, option }) => {
      modules.push(new FormControl({ id, option: { ...option, read: true } }));
    });
    const valueForm = this.profileForm.value;

    if (!this.dataUpdate) {
      this.profileService.profileForm$.next({ typeAction: 'add', formData: valueForm });
    } else {
      this.profileService.profileForm$.next({
        typeAction: 'edit',
        formData: { ...valueForm },
        profileId: this.dataUpdate.id
      });
    }
    this.profileForm.reset();
    this.editMode = false;
  }

  /**
   * @description: funcion para cerrar el formulario.
   */
  public closeForm(): void {
    this.emitCloseForm.emit();
    this.editMode = false;
    this.dataUpdate = null;
    this.profileForm.reset();
  }

  /**
   * @description: se emite hacia el componente grid-profile para que elimine el perfil.
   */
  public deleteProfile(): void {
    this.profileService.profileForm$.next({ typeAction: 'delete', formData: this.dataUpdate });
    this.editMode = false;
  }

  /**
   * @description
   * se ejecuta con el evento del componente matRadio,
   * y dependiendo del tipo de trasporte selecciondo le agregamos
   * y quitamos validacion de requerido en el formulario
   */
  public onChangeTrasport({ value }: MatRadioChange): void {
    if (value === 'mobiles') {
      this.profileForm.controls['fleets'].patchValue([]);
      this.profileForm.controls['fleets'].clearValidators();
      this.profileForm.controls['plates'].setValidators([Validators.required]);
    } else if (value === 'fleet') {
      this.profileForm.controls['plates'].patchValue([]);
      this.profileForm.controls['plates'].clearValidators();
      this.profileForm.controls['fleets'].setValidators([Validators.required]);
    }
    this.profileForm.controls['plates'].updateValueAndValidity();
    this.profileForm.controls['fleets'].updateValueAndValidity();
    this.selectTrasport = value;
  }

  /**
   * @description: se asignan los permisos de los modulos
   * @param checked - indica si esta chekeado - true o false
   * @param keyOption - el nombre del permiso
   * @param moduleId - id del modulo al que se le van asiganar los permisos
   */
  public asingOption(checked: boolean, keyOption: string, moduleId: number): void {
    const index = this.assignedModules.findIndex(module => module.id === moduleId);
    if (checked) {
      this.assignedModules[index].option[keyOption] = true;
    } else {
      this.assignedModules[index].option[keyOption] = false;
    }
  }

  /**
   * @description: funcion del drag drop, para la asignacion del modulos.
   */
  public drop(event: CdkDragDrop<IListModules[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  /**
   * @description: cuando se seleccione un perfil para editar, se le cargan los modulos que tienes asignados de los modulos disponibles.
   */
  private parseModuleUpdate(): void {
    const newAvailableModules = [...this.availableModules];
    this.assignedModules.forEach((moduleAssing) => {
      const indexModule: number = newAvailableModules.findIndex(({ id }) => id === moduleAssing.id);
      if (indexModule >= 0) {
        newAvailableModules.splice(indexModule, 1);
      }
    });
    this.availableModules = [...newAvailableModules];
  }

  /**
   * @description: Se leen y se parsean los modulos.
   */
  private readAndParseOptionModules(): void {
    this.menuOptionsService.selectState(({ modules }) => modules)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((modules) => {
        const option: IOptionPermission = {
          read: false,
          create: false,
          update: false,
          delete: false,
        };
        const modulesAvailales: IListModules[] = [];
        modules.forEach(({ children }) => {
          children.forEach(
            ({ id, title, create_option, edit_option, delete_option }) => {
              modulesAvailales.push(
                { id, title, create_option, edit_option, delete_option, option: { ...option } }
              );
            });
        });
        this.availableModules = [...modulesAvailales];
      });
  }

  /**
   * @description: Se crea el formulario reactivo.
   */
  private buildForm(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      plates: [[], Validators.required],
      fleets: [[]],
      module: this.fb.array([]),
    });
  }

}
