import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from './header-page/header-page.component';
import { TableComponent } from './table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTablePipe } from '../pipes/data-table.pipe';
import { FilterListPipe } from '../pipes/filter-list.pipe';

@NgModule({
  declarations: [HeaderPageComponent, TableComponent, DataTablePipe, FilterListPipe],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [HeaderPageComponent, TableComponent, DataTablePipe,
    FilterListPipe],
})
export class ComponentsModule { }
