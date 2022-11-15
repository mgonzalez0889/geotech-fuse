import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IOptionTable, IButtonOptions } from '../../../core/interfaces/components/table.interface';


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
  @Input() buttonTable: IButtonOptions<any>;
  @Output() emitSelectRow = new EventEmitter<any>();
  @Output() emitChangeSwitch = new EventEmitter<{ state: boolean; data: any }>();

  public dataSource: MatTableDataSource<any>;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource = new MatTableDataSource(this.dataRow);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.dataFilter;
  }

  public actionSelectRow(row: any): void {
    this.emitSelectRow.emit(row);
  }

  public actionSwitch({ checked }: MatSlideToggleChange, data: any): void {
    this.emitChangeSwitch.emit({ state: checked, data });
  }
}
