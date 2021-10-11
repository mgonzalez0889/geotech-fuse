import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormReportComponent} from "../form-report/form-report.component";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

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
    public dataHistoric: any;
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
        /*      dialogConfig.height = '600px';
                dialogConfig.width = '460px';*/
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
                this.messageExceedTime = true;
                console.log('tiene menos de 3 meses');
                if (payload.radioButton == 1) {
                    console.log('entro en 1');
                    this.subscription$ = this._historicService.getHistoricPlate(payload).subscribe((res) => {
                        let plate: string = '';
                        let historic: any = [];
                        for (let data of res) {
                            console.log('aqui', data.length);
                            plate = data.plate;
                            if (data.historic_report.length) {
                                this.messageNoReport = true;
                                data.historic_report.map(x => {
                                    x['plate'] = plate;
                                    return x;
                                });
                            } else {
                                this.messageNoReport = false;
                            }
                            data.historic_report.forEach((m) => {
                                historic.push(m);
                            });
                        }
                        this.dataSource = new MatTableDataSource(historic);
                        this.dataSource.paginator = this.paginator;
                        console.log('data', this.dataSource.data)
                    });
                } else {
                    console.log('entro en 2');
                    this.subscription$ = this._historicService.getGistoricFleet(payload).subscribe((res) => {
                        let plate: string = '';
                        let historic: any = [];
                        for (let data of res) {
                            plate = data.plate;
                            if (data.historic_report.length) {
                                this.messageNoReport = true;
                                data.historic_report.map(x => {
                                    x['plate'] = plate;
                                    return x;
                                });
                            } else {
                                this.messageNoReport = false;
                            }
                            data.historic_report.forEach((m) => {
                                historic.push(m);
                            });
                        }
                        this.dataSource = new MatTableDataSource(historic);
                        this.dataSource.paginator = this.paginator;
                    });
                }
            } else {
                this.messageExceedTime = false;
                this.messageNoReport = true;
                console.log('tiene mas de 3 meses');
            }
        });
    }

    /**
     * @description: Metodo de exportar .CSV
     */
    public downloadReport(): void {
        this.subscription$ = this._historicService.subjectDataForms.subscribe(({payload}) => {
            this._historicService.getHistoricExport(payload).subscribe((res) => {
                const csvRows = [];
                const headers = Object.keys(res[0]);
                csvRows.push(headers.join(','));
                let values: any;
                for (const row of res) {
                     values = headers.map((header) => {
                        return row[header];
                    });
                    console.log(values.join(','));
                }

                const blob = new Blob([values], {type: 'text/csv'});
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'download.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        });
    }


    public pageChange($event: PageEvent) {
        console.log('esto es event', $event);
    }

    /**
     * @description: Destruye las subscripciones
     */
    ngOnDestroy(): void {
        this.subscription$.unsubscribe();
    }


}
