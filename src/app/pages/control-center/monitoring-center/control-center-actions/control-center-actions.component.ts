/* eslint-disable @typescript-eslint/member-ordering */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HistoriesService } from 'app/core/services/histories.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';

@Component({
    selector: 'app-control-center-actions',
    templateUrl: './control-center-actions.component.html',
    styleUrls: ['./control-center-actions.component.scss'],
})
export class ControlCenterActionsComponent implements OnInit, AfterViewInit {
    public isAttended: boolean = true;
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    public dataHisotiric: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public columnsHisotiric: string[] = [
        'plate',
        'date_entry',
        'event',
        'address',
        'speed',
    ];
    constructor(
        public mapFunctionalitieService: MapFunctionalitieService,
        public historicService: HistoriesService
    ) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.mapFunctionalitieService.init();
    }
    /**
     * @description:Generr el historico y eventos de las ultimas 24H del vehiculo seleccionado
     */
    private getHistoric(): void {
        const data = {
            plate: ['GB00133'],
            owner_event_id: [5, 2, 3],
            date: {
                dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
                dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
            },
        };
        this.historicService.getHistoricPlate(data).subscribe((res) => {
            this.dataHisotiric = new MatTableDataSource(res.data);
            this.dataHisotiric.paginator = this.paginator;
            this.dataHisotiric.sort = this.sort;
        });
    }
}
