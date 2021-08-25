import { Component, OnInit } from '@angular/core';
import {EventsService} from "../../../../core/services/events.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-grid-events',
  templateUrl: './grid-events.component.html',
  styleUrls: ['./grid-events.component.scss']
})
export class GridEventsComponent implements OnInit {
    displayedColumns: string[] = ['name_events','descriptions_events','pages_events','email_events','state_events','color_events','actions_events'];
    public events$: Observable<any>;

  constructor(
      private _eventService: EventsService
  ) { }

  ngOnInit(): void {
      this.showEvents();
  }
    /**
     * @description: Mostrar todos los eventos
     */
    public showEvents(): void {
        this.events$ = this._eventService.getEvents();
    }

}
