import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlCenterDashboardComponent } from './control-center-dashboard/control-center-dashboard.component';

const routes: Routes = [
    {
        path: '',
        component:ControlCenterDashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringCenterRoutingModule { }
