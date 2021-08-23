import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridPlateOptionComponent} from './grid-plate-option/grid-plate-option.component';

const routes: Routes = [
    {
        path: '',
        component: GridPlateOptionComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateOptionsRoutingModule { }
