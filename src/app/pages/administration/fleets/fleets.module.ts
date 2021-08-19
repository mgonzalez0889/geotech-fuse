import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetsRoutingModule } from './fleets-routing.module';
import { FormFleetComponent } from './form-fleet/form-fleet.component';
import { GridFleetComponent } from './grid-fleet/grid-fleet.component';


@NgModule({
  declarations: [
    FormFleetComponent,
    GridFleetComponent
  ],
  imports: [
    CommonModule,
    FleetsRoutingModule
  ]
})
export class FleetsModule { }
