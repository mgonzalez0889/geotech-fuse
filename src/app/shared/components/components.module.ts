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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MultiSelectFilterComponent } from './multi-select-filter/multi-select-filter.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputColorComponent } from './input-color/input-color.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    HeaderPageComponent,
    TableComponent,
    DataTablePipe,
    FilterListPipe,
    MultiSelectFilterComponent,
    InputColorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoModule
  ],
  exports: [
    HeaderPageComponent,
    TableComponent,
    DataTablePipe,
    FilterListPipe,
    MultiSelectFilterComponent,
    InputColorComponent
  ],
})
export class ComponentsModule { }
