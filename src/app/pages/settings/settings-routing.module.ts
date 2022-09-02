import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'menu-option',
                loadChildren: () =>
                    import('./menu-options/menu-options.module').then(
                        (m) => m.MenuOptionsModule
                    ),
            },
            {
                path: 'plate-option',
                loadChildren: () =>
                    import('./plate-options/plate-options.module').then(
                        (m) => m.PlateOptionsModule
                    ),
            },
            {
                path: 'events',
                loadChildren: () =>
                    import('./events/events.module').then(
                        (m) => m.EventsModule
                    ),
            },
            {
                path: 'mobiles',
                loadChildren: () =>
                    import('./mobiles/mobiles.module').then(
                        (m) => m.MobilesModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
