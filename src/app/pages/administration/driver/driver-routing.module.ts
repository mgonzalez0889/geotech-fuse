import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridDriverComponent } from './grid-driver/grid-driver.component';

const routes: Routes = [
    {
        path: '',
        component: GridDriverComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverRoutingModule {}
