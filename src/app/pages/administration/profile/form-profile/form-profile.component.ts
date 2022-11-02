import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandsService } from 'app/core/services/commands.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { MenuOptionsService } from 'app/core/services/menu-options.service';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { ProfilesService } from 'app/core/services/profiles.service';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatRadioChange } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-form-profile',
  templateUrl: './form-profile.component.html',
  styleUrls: ['./form-profile.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FormProfileComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild('allSelectedMobiles') private allSelectedMobiles: MatOption;
  @ViewChild('allSelectedFleets') private allSelectedFleets: MatOption;
  public dataTableOption: MatTableDataSource<any>;

  public columnsOption: string[] = ['select', 'title', 'subtitle'];
  public columnsToDisplayWithExpand = [...this.columnsOption, 'expand'];
  public profiles: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public profileForm: FormGroup;
  public plates: any = [];
  public fleets: any = [];
  public optionMenu: any = [];
  public expandedElement = this.optionMenu;
  public typeCommands: any;
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
  private selection = new SelectionModel<any>(true, []);
  private unsubscribe$ = new Subject<void>();
  constructor(
    private profileService: ProfilesService,
    private fb: FormBuilder,
    private ownerPlateService: OwnerPlateService,
    private fleetsService: FleetsService,
    private commandsService: CommandsService,
    protected menuOptionsService: MenuOptionsService,
  ) { }

  ngOnInit(): void {
    this.ownerPlateService.getOwnerPlates().subscribe((res) => {
      this.plates = res.data;
    });
    this.fleetsService.getFleets().subscribe((res) => {
      this.fleets = res.data;
    });
    this.listenObservables();
    this.createprofileForm();
    this.getTypeCommand();
    this.getMenuOption();
  }

  public onSubmit(): void { }

  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.profileService.behaviorSubjectProfileGrid.next({
      opened: false,
      reload: false,
    });
  }

  /**
   * @description: seleccionar muchos de moviles
   */
  public allSelectionMobiles(): void {
    if (this.allSelectedMobiles.selected) {
      this.profileForm.controls['plates']
        .patchValue([...this.plates.map(item => item.plate), 0]);
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

  onChangeTrasport({ value }: MatRadioChange): void {
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
   * @description: Si el número de elementos seleccionados coincide con el número total de filas.
   */
  public isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataTableOption.data.length;
    return numSelected === numRows;
  }

  /**
   * @description: Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección.
   */
  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataTableOption.data);
  }

  /**
   * @description: Filtrar datos de la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTableOption.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Crea el formulario
   */
  private createprofileForm(): void {
    this.profileForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      typeOfSelection: [0],
      plates: [[]],
      fleets: [[]],
      commands: [''],
      rulesAcces: this.fb.array([]),
    });
  }

  /**
   * @description: Escucha el observable behavior y busca al contacto
   */
  private listenObservables(): void {

    this.profileService.behaviorSubjectProfileForm.subscribe(
      ({ newProfile, id, isEdit }) => {
        this.editMode = isEdit;
        if (newProfile) {
          this.profiles = [];
          this.profiles['name'] = newProfile;
          if (this.profileForm) {
            this.profileForm.reset();
          }
        }
        if (id) {
          // this.profileService.getContact(id).subscribe((res: any) => {
          //     this.profiles = res.data;
          //     this.profileForm.patchValue(this.profiles);
          // });
        }
      }
    );
  }


  /**
   * @description: Muestra los tipos de comandos del cliente
   */
  private getTypeCommand(): void {
    this.commandsService.getTypeCommands().subscribe((res) => {
      this.typeCommands = res.data;
    });
  }
  /**
   * @description: Trae todos las opciones del menu
   */
  private getMenuOption(): void {
    this.menuOptionsService.getMenuOptionsNew().subscribe((res) => {
      console.log('menuOptions', res);

      res.data.forEach((x) => {
        x.children.forEach((y) => {
          if (y.type === 'basic') {
            this.optionMenu.push(y);
          }
          y.children.forEach((z) => {
            if (z.type === 'basic') {
              this.optionMenu.push(z);
            }
          });
        });
      });
      this.dataTableOption = new MatTableDataSource(this.optionMenu);
      this.dataTableOption.paginator = this.paginator;
      this.dataTableOption.sort = this.sort;
    });
  }
}
