/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'general-report',
                loadChildren: () =>
                    import('./general-report/general-report.module').then(
                        (m) => m.GeneralReportModule
                    ),
            },
            {
                path: 'consolidator',
                loadChildren: () =>
                    import('./consolidator/consolidator.module').then(
                        (m) => m.ConsolidatorModule
                    ),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportsRoutingModule {}
