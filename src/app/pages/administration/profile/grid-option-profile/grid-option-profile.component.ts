import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";

export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    check1: string;
    check2: boolean;
    check3: boolean;
    check4: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, check1: 'H', check2: false, check3: false, check4: false},
    {position: 2, name: 'Helium', weight: 4.0026, check1: 'He', check2: false, check3: false, check4: false},
    {position: 3, name: 'Lithium', weight: 6.941, check1: 'Li', check2: false, check3: false, check4: false},
    {position: 4, name: 'Beryllium', weight: 9.0122, check1: 'Be', check2: false, check3: false, check4: false},
    {position: 5, name: 'Boron', weight: 10.811, check1: 'B', check2: false, check3: false, check4: false},
    {position: 6, name: 'Carbon', weight: 12.0107, check1: 'C', check2: false, check3: false, check4: false},
    {position: 7, name: 'Nitrogen', weight: 14.0067, check1: 'N', check2: false, check3: false, check4: false},
    {position: 8, name: 'Oxygen', weight: 15.9994, check1: 'O', check2: false, check3: false, check4: false},
    {position: 9, name: 'Fluorine', weight: 18.9984, check1: 'F', check2: false, check3: false, check4: false},
    {position: 10, name: 'Neon', weight: 20.1797, check1: 'Ne', check2: false, check3: false, check4: false},
];


@Component({
  selector: 'app-grid-option-profile',
  templateUrl: './grid-option-profile.component.html',
  styleUrls: ['./grid-option-profile.component.scss']
})
export class GridOptionProfileComponent implements OnInit {

   displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'check1', 'check2', 'check3', 'check4'];
   dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
   selection = new SelectionModel<PeriodicElement>(true, []);

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        console.log(this.selection);
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }
    constructor() { }

  ngOnInit(): void {
  }

}
