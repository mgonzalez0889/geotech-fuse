import {Component, OnInit, ViewChild} from '@angular/core';
import {EventsService} from "../../../../core/services/events.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from '@angular/material/paginator';

@Component({
    selector: 'app-grid-events',
    templateUrl: './grid-events.component.html',
    styleUrls: ['./grid-events.component.scss']
})
export class GridEventsComponent implements OnInit {

    public show: boolean = false;
    public displayedColumns: string[] = ['name', 'description', 'color', 'actions_events'];
    public dataSource: MatTableDataSource<any>;
    public arrayLength: number = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;


    public columnas = [
        {titulo: 'Nombre', name: 'name'},
        {titulo: 'Descripcion', name: 'description'},
        {titulo: 'Color', name: 'color'},
    ];

    constructor(
        private _eventService: EventsService
    ) {
    }

    ngOnInit(): void {
        this.showEvents();
    }

    /**
     * @description: cierra el formulario
     */
    public closeForm(value): void {
        this.show = value;
    }

    /**
     * @description: Edita un contacto
     */
    public onEdit(id: number): void {
        this.show = true;
        this.getEditContact(id);
    }

    /**
     * @description: Mostrar todos los eventos
     */
    public showEvents(): void {
        this._eventService.getEvents().subscribe((res) => {
            this.dataSource = new MatTableDataSource(res.data);
            this.dataSource.paginator = this.paginator;
            this.arrayLength = res.data.length;

        });
    }

    /**
     * @description: Mostrar informacion de un evento
     */
    private getEditContact(id: number): void {
        this._eventService.getEvent(id).subscribe(({data}) => {
            this._eventService.behaviorSubjectEvents$.next({id, isEdit: true, payload: data});
        });
    }
}
