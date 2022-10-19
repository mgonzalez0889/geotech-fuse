import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'app/core/services/reports.service';

@Component({
    selector: 'app-detail-grid-report',
    templateUrl: './detail-grid-report.component.html',
    styleUrls: ['./detail-grid-report.component.scss'],
})
export class DetailGridReportComponent implements OnInit {
    constructor(public reportService: ReportsService) {}

    ngOnInit(): void {
        // this.reportService.trips$.subscribe(trip => {
        //   console.log(trip);
        // });
    }
}
