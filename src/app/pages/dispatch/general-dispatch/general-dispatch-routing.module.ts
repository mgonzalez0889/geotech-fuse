import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridDispatchComponent } from './grid-dispatch/grid-dispatch.component';

const routes: Routes = [
    {
        path: '',
        component: GridDispatchComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GeneralDispatchRoutingModule {}
