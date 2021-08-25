import {Component, OnInit, ViewChild} from '@angular/core';
import {EventsService} from "../../../../core/services/events.service";
import {EventsInterface} from "../../../../core/interfaces/events-interface";
import {MatTableDataSource} from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-grid-events',
    templateUrl: './grid-events.component.html',
    styleUrls: ['./grid-events.component.scss']
})
export class GridEventsComponent implements OnInit {


    public displayedColumns: string[] = ['name', 'description', 'color','actions_events'];
     public dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;


    public columnas=[
        {titulo:'Nombre', name:'name'},
        {titulo:'Descripcion', name:'description'},
        {titulo:'Color', name:'color'},
    ];

    constructor(
        private _eventService: EventsService
    ) {
    }
    

    ngOnInit(): void {
        this.showEvents();
    }
    /**
     * @description: Mostrar todos los eventos
     */
    public showEvents(): void {
        this._eventService.getEvents().subscribe((res) => {
            this.dataSource = new MatTableDataSource<any>(res.data);
            this.dataSource.paginator = this.paginator;
        });
    }


}
