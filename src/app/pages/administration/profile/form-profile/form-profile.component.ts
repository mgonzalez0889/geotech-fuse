import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProfilesService } from 'app/core/services/profiles.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { MenuOptionsService } from 'app/core/services/menu-options.service';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { MatRadioChange } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';

interface IListModules {
  id: number;
  title: string;
  option: { [key: string]: boolean };
}

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss'],
})
export class FormProfileComponent implements OnInit, OnDestroy {
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
  public profileForm: FormGroup;
  public plates: any = [];
  public fleets: any = [];
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

  ngOnInit(): void {
    this.ownerPlateService.getOwnerPlates().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.plates = res.data;
    });
    this.fleetsService.getFleets().pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      this.fleets = res.data;
    });
    this.menuOptionsService.getMenuOptionsNew().pipe(takeUntil(this.unsubscribe$)).subscribe(({ data }) => {
      const option = {
        read: false,
        create: false,
        update: false,
        delete: false,
      };
      data.forEach(({ children }) => {
        this.availableModules = this.availableModules.concat(children.map(module => ({ ...module, option })));
      });
    });
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onSubmit(): void {

    const modules: FormArray = this.profileForm.get('module') as FormArray;
    this.assignedModules.forEach(({ id, option }) => {
      modules.push(new FormControl({ id, option: { ...option, read: true } }));
    });

    const valueForm = this.profileForm.value;

    if (!this.dataUpdate) {
      this.profileService.profileForm$.next({ typeAction: 'add', formData: valueForm });
    } else {
      this.profileService.profileForm$.next({ typeAction: 'edit', formData: { ...valueForm, id: this.dataUpdate.id } });
    }
    this.profileForm.reset();
    this.editMode = false;

  }

  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {

  }
  public closeForm(): void {
    this.emitCloseForm.emit();
    this.editMode = false;
    this.dataUpdate = null;
    this.profileForm.reset();
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

  public deleteProfile(): void {
    this.profileService.profileForm$.next({ typeAction: 'delete', formData: this.dataUpdate });
    this.editMode = false;
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

  public asingOption(checked: boolean, keyOption: string, idModule: number): void {
    const index = this.assignedModules.findIndex(module => module.id === idModule);
    if (checked) {
      this.assignedModules[index].option[keyOption] = true;
    } else {
      this.assignedModules[index].option[keyOption] = false;
    }
  }

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
   * @description: Crea el formulario
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
