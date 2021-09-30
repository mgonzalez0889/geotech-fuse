import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormReportComponent} from "../form-report/form-report.component";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss']
})
export class GridReportComponent implements OnInit, OnDestroy {

    public displayedColumns: string[] = ['plate', 'date_event', 'event_name', 'address', 'x', 'y', 'speed', 'battery', 'vew_map'];
    public subscription$: Subscription;
    public dataSource: MatTableDataSource<any>;
    public messageExceedTime: boolean = true;
    public messageNoReport: boolean = false;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private _historicService: HistoriesService,
    ) {
    }

    ngOnInit(): void {
        this.listenObservables();
        this.messageExceedTime = true;
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
     * @description: Escucha el observable behavior y realiza llamada a la API
     */
    private listenObservables(): void {
        this.subscription$ = this._historicService.subjectDataForms.subscribe(({payload}) => {
                let diaEnMils = 86400000;
                let diff = payload.date?.date_end.getTime() - payload.date?.date_init.getTime();
                let days = diff / diaEnMils;
                console.log('days', days);
                if (days < 91) {
                    console.log('tiene menos de 3 meses');
                    this.subscription$ = this._historicService.historicPages(payload).subscribe((res) => {
                        if (res.length) {
                            this.messageExceedTime = true;
                            let plate: string = '';
                            let historic: any = [];
                            for (let data of res) {
                                if (data.length) {
                                    plate = data.plate;
                                    if (data.historic_report.length) {
                                        data.historic_report.map(x => {
                                            x['plate'] = plate;
                                            return x;
                                        });
                                    }
                                    data.historic_report.forEach((m) => {
                                        historic.push(m);
                                    });

                                } else {
                                    this.messageExceedTime = true;
                                    this.messageNoReport = false;
                                }
                            }
                            this.dataSource = new MatTableDataSource(historic);
                            this.dataSource.paginator = this.paginator;
                        }
                    });
                } else {
                    this.messageExceedTime = false;
                    this.messageNoReport = true;
                    console.log('tiene mas de 3 meses');
                }
            }
        )
        ;
    }

    /**
     * @description: Destruye las subscripciones
     */

    ngOnDestroy()
        :
        void {
        console.log('se destruye la sub');
        this.subscription$.unsubscribe();
    }
}
