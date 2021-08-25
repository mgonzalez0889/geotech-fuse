import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {Observable, Subscription} from "rxjs";
import {MobileService} from "../../../../core/services/mobile.service";
import {FormControl} from "@angular/forms";
import {OwnerPlateService} from "../../../../core/services/owner-plate.service";
import {MatPaginator} from "@angular/material/paginator";
import {FleetsService} from "../../../../core/services/fleets.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-grid-mobile-fleet',
  templateUrl: './grid-mobile-fleet.component.html',
  styleUrls: ['./grid-mobile-fleet.component.scss']
})
export class GridMobileFleetComponent implements OnInit, OnDestroy {
    public searchInputControl: FormControl = new FormControl();
    public displayedColumns: string[] = ['select', 'plate', 'label'];
    public dataSource: any = [];
    public selection = new SelectionModel<any>(true, []);
    public subscription: Subscription;
    public arrayLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public idFleet: number = this.fleetService.behaviorSubjectUserOwnerPlateFleet$.value.id;

    constructor(
        private ownerPlateService: OwnerPlateService,
        private fleetService: FleetsService,
        private _snackBar: MatSnackBar
    ) { }

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

    ngOnInit(): void {
        this.getOwnerPlates(this.idFleet);
    }
    /**
     * @description: Trae todos los mobiles
     */
    private getOwnerPlates(id: number): void {
       this.subscription = this.ownerPlateService.getOwnerPlatesFleet(id).subscribe(({data}) => {
           this.dataSource = new MatTableDataSource(data);
           this.dataSource.paginator = this.paginator;
           this.arrayLength = data.length;
       });
    }

    private saveFleePlate(data: any): void {
        this.subscription = this.fleetService.postFleets(data).subscribe(res => {
            this._snackBar.open('Registro creado con exito', '', {duration: 4000});
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
