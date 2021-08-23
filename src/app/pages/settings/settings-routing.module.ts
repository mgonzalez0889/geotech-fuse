import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'menu-option',
                loadChildren: () => import('./menu-options/menu-options.module').then(m => m.MenuOptionsModule)
            },
            {
                path: 'plate-option',
                loadChildren: () => import('./plate-options/plate-options.module').then(m => m.PlateOptionsModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
