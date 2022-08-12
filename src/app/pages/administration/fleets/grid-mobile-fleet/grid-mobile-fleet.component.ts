import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { OwnerPlateService } from '../../../../core/services/owner-plate.service';
import { MatPaginator } from '@angular/material/paginator';
import { FleetsService } from '../../../../core/services/fleets.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from '../../../../core/services/helper.service';
import { DialogAlertEnum } from '../../../../core/interfaces/fuse-confirmation-config';
import { delay } from 'rxjs/operators';

@Component({
    selector: 'app-grid-mobile-fleet',
    templateUrl: './grid-mobile-fleet.component.html',
    styleUrls: ['./grid-mobile-fleet.component.scss'],
})
export class GridMobileFleetComponent implements OnInit, OnDestroy {
    public searchInputControl: FormControl = new FormControl();
    public displayedColumns: string[] = ['select', 'plate', 'label'];
    public dataSource: any = [];
    public selection = new SelectionModel<any>(true, []);
    public subscription: Subscription;
    public arrayLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public idFleet: number = null;
    @Output() onShow: EventEmitter<string> = new EventEmitter<string>();
    public title: string = null;

    constructor(
        private ownerPlateService: OwnerPlateService,
        private fleetService: FleetsService,
        private _snackBar: MatSnackBar,
        private _helperService: HelperService
    ) {}

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }
    /**
     * @description: Selecciona un registro de la grid
     */
    public selectionToggle(event, row): void {
        const { id } = row;
        if (event.checked) {
            const selectedValue = {
                owner_plate_id: id,
                fleet_id: this.idFleet,
            };
            this.saveFleePlate(selectedValue);
        }
    }

    ngOnInit(): void {
        this.getOwnerPlates(this.idFleet);
        this.listenObservables();
    }
    public onClose(): void {
        this.onShow.emit('FLEET');
    }
    /**
     * @description: Trae todos las placas a la flota
     */
    private getOwnerPlates(id: number): void {
        this.subscription = this.ownerPlateService
            .getOwnerPlatesFleet(id)
            .subscribe(({ data }) => {
                this.dataSource = new MatTableDataSource(data);
                this.dataSource.paginator = this.paginator;
                this.arrayLength = data.length;
            });
    }
    /**
     * @description: Asigna una nueva placa a la flota
     */
    private saveFleePlate(data: any): void {
        // this.subscription = this.fleetService
        //     .postFleetsPlate(data)
        //     .subscribe((res) => {
        //         this._snackBar.open('Registro creado con exito', '', {
        //             duration: 4000,
        //         });
        //         this.fleetService.behaviorSubjectUserOwnerPlateFleet$.next({
        //             isEdit: false,
        //         });
        //         this.fleetService.behaviorSubjectFleet$.next({ isEdit: false });
        //     });
    }
    /**
     * @description: Escucha los observables behavior
     */
    private listenObservables(): void {
        // this.subscription =
        //     this.fleetService.behaviorSubjectUserOwnerPlateFleet$
        //         .pipe(delay(1000))
        //         .subscribe(({ isEdit }) => {
        //             switch (isEdit) {
        //                 case false:
        //                     this.getOwnerPlates(this.idFleet);
        //                     break;
        //             }
        //         });
        // this.subscription = this.fleetService.behaviorSubjectFleet$.subscribe(
        //     ({ isEdit }) => {
        //         switch (isEdit) {
        //             case false:
        //                 this.getOwnerPlates(this.idFleet);
        //                 break;
        //         }
        //     }
        // );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
