import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IOptionTable } from '../../../core/interfaces/components/table.interface';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnChanges {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() dataRow: any[] = [];
    @Input() dataColumn: string[] = [];
    @Input() dataOptionTable: IOptionTable[] = [];
    @Input() dataFilter: string = '';
    @Output() emitSelectRow = new EventEmitter<any>();

    public dataSource: MatTableDataSource<any>;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        console.log(this.dataRow);

        this.dataSource = new MatTableDataSource(this.dataRow);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filter = this.dataFilter;
    }

    public actionSelectRow(row: any): void {
        console.log(row);
        this.emitSelectRow.emit(row);
    }
}
