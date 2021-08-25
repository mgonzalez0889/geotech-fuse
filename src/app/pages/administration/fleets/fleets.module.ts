import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetsRoutingModule } from './fleets-routing.module';
import { FormFleetComponent } from './form-fleet/form-fleet.component';
import { GridFleetComponent } from './grid-fleet/grid-fleet.component';
import { GridMobileFleetComponent } from './grid-mobile-fleet/grid-mobile-fleet.component';
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
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    FormFleetComponent,
    GridFleetComponent,
    GridMobileFleetComponent
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
    ]
})
export class FleetsModule { }
