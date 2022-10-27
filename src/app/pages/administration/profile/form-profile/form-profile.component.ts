import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommandsService } from 'app/core/services/commands.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { MenuOptionsService } from 'app/core/services/menu-options.service';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { ProfilesService } from 'app/core/services/profiles.service';
import { Subscription } from 'rxjs';
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
import { NavigationService } from 'app/core/navigation/navigation.service';

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
  @ViewChild('platesPanel') private platesPanel: TemplateRef<any>;
  @ViewChild('fleetsPanel') private fleetsPanel: TemplateRef<any>;
  @ViewChild('platesPanelOrigin') private platesPanelOrigin: ElementRef;
  @ViewChild('fleetsPanelOrigin') private fleetsPanelOrigin: ElementRef;
  public dataTableOption: MatTableDataSource<any>;
  public columnsOption: string[] = ['select', 'title', 'subtitle'];
  public columnsToDisplayWithExpand = [...this.columnsOption, 'expand'];
  public profiles: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public profileForm: FormGroup;
  public subscription: Subscription;
  public plates: any = [];
  public filteredPlates: any = [];
  public fleets: any = [];
  public filteredFleets: any = [];
  public optionMenu: any = [];
  public expandedElement = this.optionMenu;
  public typeCommands: any;
  private platesPanelOverlayRef: OverlayRef;
  private selection = new SelectionModel<any>(true, []);

  constructor(
    private profileService: ProfilesService,
    private fb: FormBuilder,
    private ownerPlateService: OwnerPlateService,
    private overlay: Overlay,
    private renderer2: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private fleetsService: FleetsService,
    private commandsService: CommandsService,
    private modulesServices: NavigationService,
    protected menuOptionsService: MenuOptionsService,
  ) { }

  ngOnInit(): void {

    this.modulesServices.get().subscribe((data) => {

      console.log(data);

    });
    this.listenObservables();
    this.createprofileForm();
    this.getPlates();
    this.getFleets();
    this.getTypeCommand();
    this.getMenuOption();
  }
  /**
   * @description: Valida si es edita o guarda un perfil
   */
  public onSave(): void {
    // const data = this.profileForm.getRawValue();
    // if (!data.id) {
    //     this.newContact(data);
    // } else {
    //     this.editContact(data);
    // }
  }
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
   * @description:  valida si esta leyenfo flotas o placas
   */
  public typeOfSelection(event: any): void {
    if (event.value === 0) {
      this.profileForm.patchValue({ fleets: [] });
    } else {
      this.profileForm.patchValue({ plates: [] });
    }
  }

  /**
   * @description: Abre el modal de seleccion de placas
   */
  public openPlatesPanel(): void {
    this.platesPanelOverlayRef = this.overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.platesPanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
    });
    this.platesPanelOverlayRef.attachments().subscribe(() => {
      this.renderer2.addClass(
        this.platesPanelOrigin.nativeElement,
        'panel-opened'
      );
      this.platesPanelOverlayRef.overlayElement
        .querySelector('input')
        .focus();
    });
    const templatePortal = new TemplatePortal(
      this.platesPanel,
      this.viewContainerRef
    );
    this.platesPanelOverlayRef.attach(templatePortal);
    this.platesPanelOverlayRef.backdropClick().subscribe(() => {
      this.renderer2.removeClass(
        this.platesPanelOrigin.nativeElement,
        'panel-opened'
      );
      if (
        this.platesPanelOverlayRef &&
        this.platesPanelOverlayRef.hasAttached()
      ) {
        this.platesPanelOverlayRef.detach();
        this.filteredPlates = this.plates;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }

  /**
   * @description: Filtra las placas
   */
  public filterPlates(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredPlates = this.plates.filter((plate: any) =>
      plate.plate.toLowerCase().includes(value)
    );
  }

  /**
   * @description: Click en el select de plates
   */
  public togglePlates(plate: any): void {
    if (this.profileForm.get('plates').value.includes(plate.id)) {
      this.removePlatesFromContact(plate);
    } else {
      this.addPlateFromContact(plate);
    }
  }

  /**
   * @description: Elimina la placa seleccionada
   */
  public removePlatesFromContact(plate: any): void {
    this.profileForm.get('plates').value.splice(
      this.profileForm
        .get('plates')
        .value.findIndex((item: any) => item === plate.id),
      1
    );
    this.changeDetectorRef.markForCheck();
  }

  /**
   * @description: Agrega  la placa seleccionada
   */
  public addPlateFromContact(plate: any): void {
    this.profileForm.get('plates').value.unshift(plate.id);
    this.changeDetectorRef.markForCheck();
  }
  /**
   * @description: Abre el modal de seleccion de flotas
   */
  public openFleetsPanel(): void {
    this.platesPanelOverlayRef = this.overlay.create({
      backdropClass: '',
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.fleetsPanelOrigin.nativeElement)
        .withFlexibleDimensions(true)
        .withViewportMargin(64)
        .withLockedPosition(true)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
    });
    this.platesPanelOverlayRef.attachments().subscribe(() => {
      this.renderer2.addClass(
        this.fleetsPanelOrigin.nativeElement,
        'panel-opened'
      );
      this.platesPanelOverlayRef.overlayElement
        .querySelector('input')
        .focus();
    });
    const templatePortal = new TemplatePortal(
      this.fleetsPanel,
      this.viewContainerRef
    );
    this.platesPanelOverlayRef.attach(templatePortal);
    this.platesPanelOverlayRef.backdropClick().subscribe(() => {
      this.renderer2.removeClass(
        this.fleetsPanelOrigin.nativeElement,
        'panel-opened'
      );
      if (
        this.platesPanelOverlayRef &&
        this.platesPanelOverlayRef.hasAttached()
      ) {
        this.platesPanelOverlayRef.detach();
        this.filteredPlates = this.plates;
      }
      if (templatePortal && templatePortal.isAttached) {
        templatePortal.detach();
      }
    });
  }
  /**
   * @description: Filtra las flotas
   */
  public filterFleets(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredFleets = this.fleets.filter((fleet: any) =>
      fleet.name.toLowerCase().includes(value)
    );
  }
  /**
   * @description: Click en el select de flotas
   */
  public toggleFleets(fleet: any): void {
    if (this.profileForm.get('fleets').value.includes(fleet.id)) {
      this.removeFleetFromContact(fleet);
    } else {
      this.addFleetFromContact(fleet);
    }
  }
  /**
   * @description: Elimina las flotas seleccionada
   */
  public removeFleetFromContact(fleet: any): void {
    this.profileForm.get('fleets').value.splice(
      this.profileForm
        .get('fleets')
        .value.findIndex((item: any) => item === fleet.id),
      1
    );
    this.changeDetectorRef.markForCheck();
  }
  /**
   * @description: Agrega  la placa seleccionada
   */
  public addFleetFromContact(fleet: any): void {
    this.profileForm.get('fleets').value.unshift(fleet.id);
    this.changeDetectorRef.markForCheck();
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
    this.subscription.unsubscribe();
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
   * @description: Agrega una nueva regla de acceso
   */

  // public addOption(): void {
  //     const optionFormGroup = this.fb.group({
  //         id: [0],
  //     });
  //     (this.profileForm.get('rulesAcces') as FormArray).push(optionFormGroup);
  // }

  /**
   * @description: Escucha el observable behavior y busca al contacto
   */
  private listenObservables(): void {
    this.subscription =
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
   * @description: Funcion trae las placas del cliente
   */
  private getPlates(): void {
    this.ownerPlateService.getOwnerPlates().subscribe((res) => {
      this.plates = res.data;
      this.filteredPlates = res.data;
    });
  }
  /**
   * @description: Funcion trae las flotas del cliente
   */
  private getFleets(): void {
    this.fleetsService.getFleets().subscribe((res) => {
      this.fleets = res.data;
      this.filteredFleets = res.data;
    });
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
  private actionsMenu(): void { }
}
