import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormReportComponent} from "../form-report/form-report.component";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Subscription} from "rxjs";
import {variable} from "@angular/compiler/src/output/output_ast";
import dateutil from "rrule/dist/esm/src/dateutil";

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss']
})
export class GridReportComponent implements OnInit {

    public displayedColumns: string[] = ['plate', 'date_event', 'event_name', 'address', 'x', 'y', 'speed', 'battery', 'vew_map'];
    public subscription$: Subscription;
    public dataSource: MatTableDataSource<any>;

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService,
    ) {
    }

    ngOnInit(): void {
        this.listenObservables();
    }

    public generateReport(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.height = '600px';
        dialogConfig.width = '460px';
        const dialogRef = this.dialog.open(FormReportComponent, dialogConfig);
        dialogRef.afterClosed().subscribe((res) => {
            console.log(res);
        });
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription$ = this._historicService.subjectDataHistories.subscribe(({payload, show}) => {
            let myArray = [];
            if (show) {
                console.log(show);
                const myArray = [];
                Object.assign(myArray, payload.historic_report);
                console.log(myArray);

            }

        });
    }
}
