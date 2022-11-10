import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralReportRoutingModule } from './general-report-routing.module';
import { FormReportComponent } from './form-report/form-report.component';
import { GridReportComponent } from './grid-report/grid-report.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'app/shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [FormReportComponent, GridReportComponent],
  imports: [
    CommonModule,
    GeneralReportRoutingModule,
    MatDatepickerModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class GeneralReportModule { }
