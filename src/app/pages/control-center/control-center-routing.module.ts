import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'monitoring-center',
                loadChildren: () => import('./monitoring-center/monitoring-center.module').then(m => m.MonitoringCenterModule)
            }
        ]

    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlCenterRoutingModule { }
