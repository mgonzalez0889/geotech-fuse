import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'general-dispatch',
                loadChildren: (): Promise<any> =>
                    import('./general-dispatch/general-dispatch.module').then(
                        m => m.GeneralDispatchModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DispatchRoutingModule {}
