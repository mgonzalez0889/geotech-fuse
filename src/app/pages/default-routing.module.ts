import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'administration',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
            },
            {
                path: 'tracking',
                loadChildren: () => import('./tracking/tracking.module').then(m => m.TrackingModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
