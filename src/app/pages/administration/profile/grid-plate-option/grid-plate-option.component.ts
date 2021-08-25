import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserProfilePlateService} from "../../../../core/services/user-profile-plate.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-grid-plate-option',
  templateUrl: './grid-plate-option.component.html',
  styleUrls: ['./grid-plate-option.component.scss']
})
export class GridPlateOptionComponent implements OnInit, OnDestroy {
  searchInputControl: FormControl = new FormControl();
  public displayedColumns: string[] = ['select', 'plate', 'name'];
  public dataSource: any = [];
  public subscription: Subscription;
  public show: boolean = false;
  public selection = new SelectionModel<any>(true, []);
  public arrayLength: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
      private userProfilePlateService: UserProfilePlateService,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
      this.getUserProfilePlate();
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
         this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /**
   * @description: Selecciona un registro de la grid
   */
  public selectionToggle(event, row): void {
      const {id} = row;
      if (event.checked) {
          this.deleteUserProfilePlate(id);
      }
  }
  /**
   * @description:
   */
  public openForm(): void {
      this.show = true;
      this.userProfilePlateService.behaviorSubjectUserProfilePlate$.next({type: 'NEW', isEdit: false});
  }
  /**
   * @description: Cierra el formulario
   */
  public closeForm(value): void {
      this.show = false;
  }
  /**
   * @description: Carga todos los plates asignados
   */
  private getUserProfilePlate(): void {
      this.subscription = this.userProfilePlateService.getUserProfilePlate().subscribe(({data}) => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.arrayLength = data.length;
      });
  }
  /**
   * @description: Elimina un registro de la grilla
   */
  private deleteUserProfilePlate(id: number): void {
      this.subscription = this.userProfilePlateService.deleteUserProfilePlate(id).subscribe(res => {
          this._snackBar.open('Registro eliminado con exito', '', {duration: 4000});
          this.userProfilePlateService.behaviorSubjectUserProfilePlate$.next({isEdit: false});
      });
  }
   /**
    * @description: Escucha el observables
    */
  private listenObservables(): void {
      this.subscription = this.userProfilePlateService.behaviorSubjectUserProfilePlate$.subscribe(({isEdit}) => {
          switch (isEdit) {
              case false:
                  this.getUserProfilePlate();
                  break;
              case true:
                  this.getUserProfilePlate();
                  break;
          }
      });
  }

    ngOnDestroy(): void {
      // this.subscription.unsubscribe();
    }

}
