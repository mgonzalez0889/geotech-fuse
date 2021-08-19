import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridFleetComponent } from './grid-fleet/grid-fleet.component';

const routes: Routes = [
  {
    path: '',
    component: GridFleetComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FleetsRoutingModule { }
