import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAlertComponent } from './grid-alert/grid-alert.component';
import { FormAlertComponent } from './form-alert/form-alert.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GridAlertComponent,
    FormAlertComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: GridAlertComponent }])
  ]
})
export class AlertModule { }
