import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'monitoring-center',
                loadChildren: () => import('./monitoring-center/monitoring-center.module').then(m => m.MonitoringCenterModule)
            },
            {
                path: 'contacts-control-center',
                loadChildren: () => import('./contacts-control-center/contacts-control-center.module').then(m => m.ContactsControlCenterModule)
            }
        ]

    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlCenterRoutingModule { }
