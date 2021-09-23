import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormReportComponent} from "../form-report/form-report.component";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Subscription} from "rxjs";
import {variable} from "@angular/compiler/src/output/output_ast";

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss']
})
export class GridReportComponent implements OnInit {

    public displayedColumns: string[] = ['plate', 'date_event','event_name','address','x','y','speed','battery','vew_map'];
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
        this.subscription$ = this._historicService.subjectDataHistories.subscribe(({payload}) => {
            // console.log(payload);
            if (payload.length) {
                //console.log(payload);
                let plate: string = '';

                for (let data of payload) {
                    plate = data.plate;
                    let variable = data.time_line;
                    //console.log('imprimer el tipo data line ',typeof data.time_line);
                    // console.log('imprimer el tipo data line ',data.time_line);
                    //console.log('imprimer el tipo data line ', variable);
                    if (data.time_line.length) {
                        console.log('ENTRAAAA');
                        data.time_line.map(x => {
                            x['plate'] = plate;
                            return x;
                        });
                    }
                    console.log('imprimer variable  ',variable);
                    this.dataSource = new MatTableDataSource(variable
                    );

                }
               // console.log('imprimir el payload transformado', payload);


            }
        });
    }
}
