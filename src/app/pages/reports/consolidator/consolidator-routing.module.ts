import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GridReportComponent } from './grid-report/grid-report.component';

const routes: Routes = [
    {
        path: '',
        component: GridReportComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ConsolidatorRoutingModule {}
