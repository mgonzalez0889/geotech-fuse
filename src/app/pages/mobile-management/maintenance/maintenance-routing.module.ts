import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridMaintenanceComponent} from "./grid-maintenance/grid-maintenance.component";

const routes: Routes = [
    {
        path: '',
        component: GridMaintenanceComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRoutingModule { }
