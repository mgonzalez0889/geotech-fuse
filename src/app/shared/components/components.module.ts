import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from './header-page/header-page.component';
import { TableComponent } from './table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { DataTablePipe } from './table/data-table.pipe';

@NgModule({
    declarations: [HeaderPageComponent, TableComponent, DataTablePipe],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule,
    ],
    exports: [HeaderPageComponent, TableComponent],
})
export class ComponentsModule {}
