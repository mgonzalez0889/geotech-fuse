import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridReportComponent } from './grid-report/grid-report.component';
import { ReportTimeLineComponent } from './report-time-line/report-time-line.component';

const routes: Routes = [
    {
        path: '',
        component: GridReportComponent,
    },
    {
        path: 'time-line',
        component: ReportTimeLineComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GeneralReportRoutingModule {}
