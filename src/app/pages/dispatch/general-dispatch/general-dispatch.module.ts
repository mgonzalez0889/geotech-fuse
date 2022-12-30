import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralDispatchRoutingModule } from './general-dispatch-routing.module';
import { FormDispatchComponent } from './form-dispatch/form-dispatch.component';
import { GridDispatchComponent } from './grid-dispatch/grid-dispatch.component';
import { SharedModule } from '../../../shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [FormDispatchComponent, GridDispatchComponent],
  imports: [
    CommonModule,
    GeneralDispatchRoutingModule,
    SharedModule
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'dispatch' }],

})
export class GeneralDispatchModule { }
