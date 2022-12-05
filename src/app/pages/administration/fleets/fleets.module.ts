import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetsRoutingModule } from './fleets-routing.module';
import { FormFleetComponent } from './form-fleet/form-fleet.component';
import { GridFleetComponent } from './grid-fleet/grid-fleet.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    FormFleetComponent,
    GridFleetComponent,
  ],
  imports: [
    CommonModule,
    FleetsRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    CdkScrollableModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSortModule,
    MatTooltipModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
})
export class FleetsModule { }
