import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {SelectionModel} from '@angular/cdk/collections';
import {FleetsService} from "../../../../core/services/fleets.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HelperService} from "../../../../core/services/helper.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {DialogAlertEnum} from "../../../../core/interfaces/fuse-confirmation-config";

@Component({
  selector: 'app-grid-mobile-fleet-assined',
  templateUrl: './grid-mobile-fleet-assined.component.html',
  styleUrls: ['./grid-mobile-fleet-assined.component.scss']
})
export class GridMobileFleetAssinedComponent implements OnInit {
  public searchInputControl: FormControl = new FormControl();
  public displayedColumns: string[] = ['select', 'plate', 'name'];
  public dataSource: any = [];
  public subscription: Subscription;
  public selection = new SelectionModel<any>(true, []);
  public arrayLength: number = 0;
  public idFleet: number = null
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public show: boolean = false;
  constructor(
      private fleetService: FleetsService,
      private _snackBar: MatSnackBar,
      private helperService: HelperService
  ) { }

  ngOnInit(): void {
      this.getFleetPlatesAssigned(this.idFleet);
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
            this.helperService.showDialogAlertOption({
                title: 'Eliminar registro',
                text: '¿Desea eliminar esta placa?',
                type: DialogAlertEnum.question,
                showCancelButton: true,
                textCancelButton: 'No',
                textConfirButton: 'Si'
            }).then(
                (result) => {
                    if (result.value) {
                        this.deleteFleetPlateAssigned(id);
                    }
                }
            );
        }
    }

    private getFleetPlatesAssigned(id: number): void {
        this.subscription = this.fleetService.getFleetsPlatesAssigned(id).subscribe(({data}) => {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.arrayLength = data?.length;
        });
    }

    /**
     * @description: Cierra el formulario
     */
    public closeForm(value): void {
        this.show = false;
    }
    /**
     * @description: Elimina una placa asignada
     */
    private deleteFleetPlateAssigned(id: number): void {
        this.subscription = this.fleetService.deleteFleetsPlate(id).subscribe(res => {
            this._snackBar.open('Registro eliminado con exito', '', {duration: 4000});
            // this.fleetService.behaviorSubjectFleet$.next({isEdit: false});
        });
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        // this.subscription = this.fleetService.behaviorSubjectFleet$.subscribe(({isEdit}) => {
        //     switch (isEdit) {
        //         case false:
        //             this.getFleetPlatesAssigned(this.idFleet);
        //             break;
        //     }
        // });
    }

}
