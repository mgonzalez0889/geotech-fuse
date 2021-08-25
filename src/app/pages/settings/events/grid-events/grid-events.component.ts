import {Component, OnInit} from '@angular/core';
import {EventsService} from "../../../../core/services/events.service";
import {EventsInterface} from "../../../../core/interfaces/events-interface";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-grid-events',
    templateUrl: './grid-events.component.html',
    styleUrls: ['./grid-events.component.scss']
})
export class GridEventsComponent implements OnInit {
    public data: EventsInterface[];
    displayedColumns: string[] = ['name', 'description', 'color'];
    public dataSource: MatTableDataSource<EventsInterface>;
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
            this.data = res;
            this.dataSource = new MatTableDataSource<EventsInterface>(this.data);
        });
    }

}
