import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralDispatchRoutingModule } from './general-dispatch-routing.module';
import { FormDispatchComponent } from './form-dispatch/form-dispatch.component';
import { GridDispatchComponent } from './grid-dispatch/grid-dispatch.component';


@NgModule({
  declarations: [
    FormDispatchComponent,
    GridDispatchComponent
  ],
  imports: [
    CommonModule,
    GeneralDispatchRoutingModule
  ]
})
export class GeneralDispatchModule { }
