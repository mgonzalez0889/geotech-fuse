import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { FormMaintenanceComponent } from './form-maintenance/form-maintenance.component';
import { GridMaintenanceComponent } from './grid-maintenance/grid-maintenance.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    FormMaintenanceComponent,
    GridMaintenanceComponent
  ],
    imports: [
        CommonModule,
        MaintenanceRoutingModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTableModule
    ]
})
export class MaintenanceModule { }
