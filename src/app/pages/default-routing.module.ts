import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'administration',
        loadChildren: (): Promise<any> =>
          import('./administration/administration.module').then(
            m => m.AdministrationModule
          ),
      },
      {
        path: 'settings',
        loadChildren: (): Promise<any> =>
          import('./settings/settings.module').then(
            m => m.SettingsModule
          ),
      },
      {
        path: 'tracking',
        loadChildren: (): Promise<any> =>
          import('./tracking/tracking.module').then(
            m => m.TrackingModule
          ),
      },
      {
        path: 'mobile-management',
        loadChildren: (): Promise<any> =>
          import('./mobile-management/mobile-management.module').then(
            m => m.MobileManagementModule
          ),
      },
      {
        path: 'reports',
        loadChildren: (): Promise<any> =>
          import('./reports/reports.module').then(
            m => m.ReportsModule
          ),
      },
      {
        path: 'control-center',
        loadChildren: (): Promise<any> =>
          import('./control-center/control-center.module').then(
            m => m.ControlCenterModule
          ),
      },
      {
        path: 'dispatch',
        loadChildren: (): Promise<any> =>
          import('./dispatch/dispatch.module').then(
            m => m.DispatchModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultRoutingModule { }
