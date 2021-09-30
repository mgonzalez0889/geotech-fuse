import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralReportRoutingModule } from './general-report-routing.module';
import { FormReportComponent } from './form-report/form-report.component';
import { GridReportComponent } from './grid-report/grid-report.component';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatDividerModule} from "@angular/material/divider";
import {NgxPaginationModule} from "ngx-pagination";
import {MatPaginatorModule} from "@angular/material/paginator";

@NgModule({
  declarations: [
    FormReportComponent,
    GridReportComponent
  ],
    imports: [
        CommonModule,
        GeneralReportRoutingModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        NgMultiSelectDropDownModule.forRoot(),
        MatFormFieldModule,
        MatDatepickerModule,
        NgxDaterangepickerMd.forRoot(),
        FormsModule,
        MatCardModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatRadioModule,
        MatDividerModule,
        NgxPaginationModule,
        MatPaginatorModule

    ]
})
export class GeneralReportModule { }
