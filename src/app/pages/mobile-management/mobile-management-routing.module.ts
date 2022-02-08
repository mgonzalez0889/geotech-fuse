import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MaintenanceModule} from "./maintenance/maintenance.module";

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'maintenance',
                loadChildren: () => MaintenanceModule
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileManagementRoutingModule { }
