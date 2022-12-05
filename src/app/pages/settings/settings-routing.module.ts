import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'menu-option',
        loadChildren: (): Promise<any> =>
          import('./menu-options/menu-options.module').then(
            m => m.MenuOptionsModule
          ),
      },
      {
        path: 'events',
        loadChildren: (): Promise<any> =>
          import('./events/events.module').then(
            m => m.EventsModule
          ),
      },
      {
        path: 'mobiles',
        loadChildren: (): Promise<any> =>
          import('./mobiles/mobiles.module').then(
            m => m.MobilesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
