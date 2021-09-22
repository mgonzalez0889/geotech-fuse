import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {FormReportComponent} from "../form-report/form-report.component";
import {HistoriesService} from "../../../../core/services/histories.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-grid-report',
    templateUrl: './grid-report.component.html',
    styleUrls: ['./grid-report.component.scss']
})
export class GridReportComponent implements OnInit {

    public displayedColumns: string[] = ['plate', 'internal_code', 'date_event', 'event_name', 'address', 'x', 'y', 'speed'];
    public subscription$: Subscription;
    public dataSource: MatTableDataSource<any>;
    public columnas = [
        {titulo: 'Placa', name: 'plate'},
        {titulo: 'Código interno', name: 'internal_code'},
        {titulo: 'Fecha', name: 'date_event'},
        {titulo: 'Evento', name: 'event_name'},
        {titulo: 'Dirección', name: 'address'},
        {titulo: 'Latitud', name: 'x'},
        {titulo: 'Longitud', name: 'y'},
        {titulo: 'Velocidad', name: 'speed'}
    ];

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
            console.log(payload.);
            this.dataSource = new MatTableDataSource(payload);
        });
    }
}
