import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';
import { FleetsService } from 'app/core/services/fleets.service';
import { IListModules, IOptionPermission } from 'app/core/interfaces';
import { ProfilesService } from 'app/core/services/api/profiles.service';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { MenuOptionsService } from 'app/core/services/menu-options.service';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss'],
})
export class FormProfileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataUpdate: any = null;
  @Input() titleForm: string = '';
  @Output() emitCloseForm = new EventEmitter<void>();
  @ViewChild('allSelectedMobiles') private allSelectedMobiles: MatOption;
  @ViewChild('allSelectedFleets') private allSelectedFleets: MatOption;
  public profiles: any = [];
  public editMode: boolean = false;
  public valueFilterFleets = '';
  public valueFilterMobiles = '';
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
      text: 'Moviles',
    },
    {
      name: 'fleet',
      text: 'Flota',
    },
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private profileService: ProfilesService,
    private fb: FormBuilder,
    private ownerPlateService: OwnerPlateService,
    private fleetsService: FleetsService,
    private menuOptionsService: MenuOptionsService,
  ) { }

  /**
   * @description: se llaman todos los servicios y se crea el formulario reactivo.
   */
  ngOnInit(): void {
    this.ownerPlateService.getOwnerPlates().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.plates = res.data;
    });
    this.fleetsService.getFleets().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.fleets = res.data;
    });

    this.readAndParseOptionModules();
    this.buildForm();
  }


  /**
   * @description: si viene informacion para modificar, seteamos el formulario o lo limpiamos.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataUpdate) {
      this.editMode = false;
      this.profileForm.patchValue({ ...this.dataUpdate });
    } else {
      this.editMode = false;
      this.profileForm.reset();
    }
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
   * @description: seleccionar muchos de moviles
   */
  public allSelectionMobiles(): void {
    if (this.allSelectedMobiles.selected) {
      this.profileForm.controls['plates']
        .patchValue([...this.plates.map(item => item.id), 0]);
    } else {
      this.profileForm.controls['plates'].patchValue([]);
    }
  }

  /**
   * @description: seleccionar muchos de flotas
   */
  public allSelectionFleets(): void {
    if (this.allSelectedFleets.selected) {
      this.profileForm.controls['fleets']
        .patchValue([...this.fleets.map(item => item.id), 0]);
    } else {
      this.profileForm.controls['fleets'].patchValue([]);
    }
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
   * @param checked - indica si esta checkedo el check
   * @param keyOption - el nombre del permiso
   * @param moduleId - id del modulo al que se le van asiganar permisos
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
   * @description: Se leen y se parsean los modulos.
   */
  private readAndParseOptionModules(): void {
    this.menuOptionsService.getMenuOptionsNew()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {

        const option: IOptionPermission = {
          read: false,
          create: false,
          update: false,
          delete: false,
        };

        data.forEach(({ children }) => {
          children.forEach(({ id, title, createOption, editOption, deleteOption }) => {
            this.availableModules.push({ id, title, createOption, editOption, deleteOption, option: { ...option } });
          });
        });
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

    if (this.dataUpdate) {
      this.profileForm.patchValue({ ...this.dataUpdate });
    }
  }

}
