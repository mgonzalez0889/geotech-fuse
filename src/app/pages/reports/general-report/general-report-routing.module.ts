import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GridReportComponent} from "./grid-report/grid-report.component";
import {FormReportComponent} from "./form-report/form-report.component";

const routes: Routes = [
    {
        path: '',
        component:FormReportComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralReportRoutingModule { }
