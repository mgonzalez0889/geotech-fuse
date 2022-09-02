import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobilesRoutingModule } from './mobiles-routing.module';
import { FormMobilesComponent } from './form-mobiles/form-mobiles.component';
import { GridMobilesComponent } from './grid-mobiles/grid-mobiles.component';


@NgModule({
  declarations: [
    FormMobilesComponent,
    GridMobilesComponent
  ],
  imports: [
    CommonModule,
    MobilesRoutingModule
  ]
})
export class MobilesModule { }
