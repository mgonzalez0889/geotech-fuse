import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridUserComponent} from './grid-user/grid-user.component';


const routes: Routes = [
    {
        path: '',
        component: GridUserComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
