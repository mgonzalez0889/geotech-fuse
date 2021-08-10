import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridProfileComponent} from "./grid-profile/grid-profile.component";

const routes: Routes = [
    {
        path: '',
        component: GridProfileComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
