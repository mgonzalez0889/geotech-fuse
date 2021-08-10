import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridMenuOptionsComponent} from "./grid-menu-options/grid-menu-options.component";

const routes: Routes = [
    {
        path: '',
        component: GridMenuOptionsComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuOptionsRoutingModule { }
