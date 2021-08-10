import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'profile',
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'contact',
                loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
