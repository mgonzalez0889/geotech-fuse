import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { FormMaintenanceComponent } from './form-maintenance/form-maintenance.component';
import { GridMaintenanceComponent } from './grid-maintenance/grid-maintenance.component';


@NgModule({
  declarations: [
    FormMaintenanceComponent,
    GridMaintenanceComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule
  ]
})
export class MaintenanceModule { }
