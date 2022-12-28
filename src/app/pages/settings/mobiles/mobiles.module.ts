import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobilesRoutingModule } from './mobiles-routing.module';
import { FormMobilesComponent } from './form-mobiles/form-mobiles.component';
import { GridMobilesComponent } from './grid-mobiles/grid-mobiles.component';
import { SharedModule } from '../../../shared/shared.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@NgModule({
  declarations: [FormMobilesComponent, GridMobilesComponent],
  imports: [
    CommonModule,
    MobilesRoutingModule,
    SharedModule
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'mobile' }],
})
export class MobilesModule { }
