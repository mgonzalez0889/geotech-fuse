import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobilesRoutingModule } from './mobiles-routing.module';
import { FormMobilesComponent } from './form-mobiles/form-mobiles.component';
import { GridMobilesComponent } from './grid-mobiles/grid-mobiles.component';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [FormMobilesComponent, GridMobilesComponent],
  imports: [
    CommonModule,
    MobilesRoutingModule,
    MatInputModule,
    MatOptionModule,
    SharedModule
  ],
})
export class MobilesModule { }
