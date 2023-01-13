import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAlertComponent } from './grid-alert/grid-alert.component';
import { FormAlertComponent } from './form-alert/form-alert.component';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { CalendarDaysComponent } from './calendar-days/calendar-days.component';

@NgModule({
  declarations: [
    GridAlertComponent,
    FormAlertComponent,
    CalendarDaysComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: GridAlertComponent }])
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'alerts' }],
})
export class AlertModule { }
