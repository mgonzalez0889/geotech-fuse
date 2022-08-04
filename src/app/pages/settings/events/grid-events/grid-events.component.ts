/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventsService } from 'app/core/services/events.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-grid-events',
    templateUrl: './grid-events.component.html',
    styleUrls: ['./grid-events.component.scss'],
})
export class GridEventsComponent implements OnInit, OnDestroy {
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableEvents: MatTableDataSource<any>;
    public eventsCount: number = 0;
    public columnsContactsControlCenter: string[] = [
        'color',
        'name',
        'description',
        'notificationMail',
        'notificationPage',
        'notificationSms',
        'notificationSound',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private eventService: EventsService) {}

    ngOnInit(): void {
        this.getEvents();
        this.listenObservables();
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableEvents.filter = filterValue.trim().toLowerCase();
    }
    /**
     * @description: Guarda el ID del evento para aburirlo en el formulario
     */
    public actionsEvent(id: number): void {
        this.opened = true;
        this.eventService.behaviorSubjectEventForm.next({
            id: id,
            isEdit: false,
        });
    }
    /**
     * @description: Escucha el observable behavior
     */
    private listenObservables(): void {
        this.subscription =
            this.eventService.behaviorSubjectEventGrid.subscribe(
                ({ reload, opened }) => {
                    this.opened = opened;
                    if (reload) {
                        this.getEvents();
                    }
                }
            );
    }

    /**
     * @description: Mostrar todos los eventos
     */
    private getEvents(): void {
        this.eventService.getEvents().subscribe((res) => {
            if (res.data) {
                this.eventsCount = res.data.length;
            } else {
                this.eventsCount = 0;
            }
            this.dataTableEvents = new MatTableDataSource(res.data);
            this.dataTableEvents.paginator = this.paginator;
            this.dataTableEvents.sort = this.sort;
        });
    }
    /**
     * @description: Destruye el observable
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
