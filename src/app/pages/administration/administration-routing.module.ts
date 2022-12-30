import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        loadChildren: (): Promise<any> =>
          import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'profile',
        loadChildren: (): Promise<any> =>
          import('./profile/profile.module').then(
            m => m.ProfileModule
          ),
      },
      {
        path: 'contacts',
        loadChildren: (): Promise<any> =>
          import('./contact/contact.module').then(
            m => m.ContactModule
          ),
      },
      {
        path: 'fleets',
        loadChildren: (): Promise<any> =>
          import('./fleets/fleets.module').then(
            m => m.FleetsModule
          ),
      },
      {
        path: 'driver',
        loadChildren: (): Promise<any> =>
          import('./driver/driver.module').then(
            m => m.DriverModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule { }
