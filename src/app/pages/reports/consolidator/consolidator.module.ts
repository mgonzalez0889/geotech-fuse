import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsolidatorRoutingModule } from './consolidator-routing.module';
import { FormReportComponent } from './form-report/form-report.component';
import { GridReportComponent } from './grid-report/grid-report.component';
import { DetailGridReportComponent } from './detail-grid-report/detail-grid-report.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    FormReportComponent,
    GridReportComponent,
    DetailGridReportComponent,
  ],
  imports: [
    CommonModule,
    ConsolidatorRoutingModule,
    SharedModule,
  ],
})
export class ConsolidatorModule { }
