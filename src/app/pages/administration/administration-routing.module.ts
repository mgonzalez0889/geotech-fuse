import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormFleetComponent } from './fleets/form-fleet/form-fleet.component';

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
                path: 'contacts',
                loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule)
            },
            {
                path: 'fleets',
                loadChildren: () => import('./fleets/fleets.module').then(m => m.FleetsModule)
            },
            {
                path: 'formfleet', component: FormFleetComponent
            }
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }
