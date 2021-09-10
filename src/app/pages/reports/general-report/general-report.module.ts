import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralReportRoutingModule } from './general-report-routing.module';
import { FormReportComponent } from './form-report/form-report.component';
import { GridReportComponent } from './grid-report/grid-report.component';
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    FormReportComponent,
    GridReportComponent
  ],
    imports: [
        CommonModule,
        GeneralReportRoutingModule,
        MatDialogModule
    ]
})
export class GeneralReportModule { }
