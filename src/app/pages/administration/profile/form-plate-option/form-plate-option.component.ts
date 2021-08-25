import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {ProfilesService} from "../../../../core/services/profiles.service";
import {Observable, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {UserProfilePlateService} from "../../../../core/services/user-profile-plate.service";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {OwnerPlateService} from "../../../../core/services/owner-plate.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";
import {delay, tap} from "rxjs/operators";

@Component({
  selector: 'app-form-plate-option',
  templateUrl: './form-plate-option.component.html',
  styleUrls: ['./form-plate-option.component.scss'],
})
export class FormPlateOptionComponent implements OnInit, AfterViewInit, OnDestroy {
  public profile$: Observable<any>;
  public searchInputControl: FormControl = new FormControl();
  public displayedColumns: string[] = ['select', 'plate', 'label'];
  public dataSource: any = [];
  public subscription: Subscription;
  public selection = new SelectionModel<any>(true, []);
  public userProfileId: number = this.ownerPlateService.behaviorSubjectUserOwnerPlate$.value.id;
  public arrayLength: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onShow: EventEmitter<string> = new EventEmitter<string>();
  constructor(
      private profileService: ProfilesService,
      private userProfilePlateService: UserProfilePlateService,
      private ownerPlateService: OwnerPlateService,
      private _snackBar: MatSnackBar,
  ) { }

    ngAfterViewInit(): void {
        this.paginator.page.pipe(
            tap(() => this.getPlates())
        ).subscribe();
    }

  ngOnInit(): void {
      this.getProfiles();
      this.getPlates();
      this.listenObservables();
  }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle(): void {
        console.log(this.selection);
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach((row) => { this.selection.select(row); });
    }
    /**
     * @description: Selecciona un registro de la grid
     */
    public selectionToggle(event, row): void {
        console.log(event);
        console.log(row);
        const {id} = row;
        if (event.checked) {
            const selectedValue = {
                user_profile_id: this.userProfileId,
                owner_plate_id: id
            };
            this.savePlates(selectedValue);
        }
    }
    /**
     * @description: Cierra el componente
     */
    public onClose(): void {
        this.onShow.emit('PROFILES');
    }
  /**
   * @description: Trae todos los profiles
   */
  private getProfiles(): void {
      this.profile$ = this.profileService.getProfiles();
  }
  /**
   * @description: Escucha el observable de ownerPlate behavior
   */
  private listenObservables(): void {
      this.subscription = this.ownerPlateService.behaviorSubjectUserOwnerPlate$
      .pipe(delay(1000))
      .subscribe(({isEdit}) => {
          switch (isEdit) {
              case false :
                  this.getPlates();
                  break;
          }
      });
  }
  /**
   * @description: Carga todas las placas
   */
  private getPlates(): void {
      this.subscription = this.ownerPlateService.getOwnerPlates().subscribe(({data}) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.arrayLength = data.length;
      });
  }
  /**
   * @description: Almacena las placas para el perfil
   */
  private savePlates(data: any): void {
      this.subscription = this.userProfilePlateService.postUserProfilePlate(data).subscribe(res => {
          this._snackBar.open('Registro creado con exito', '', {duration: 4000});
          this.userProfilePlateService.behaviorSubjectUserProfilePlate$.next({isEdit: false});
          this.ownerPlateService.behaviorSubjectUserOwnerPlate$.next({isEdit: false});
      });
  }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
