import { Component, OnInit } from '@angular/core';
import { EventsService } from 'app/core/services/events.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import moment from 'moment';
import { Observable, Subscription } from "rxjs";

@Component({
  selector: 'app-historics',
  templateUrl: './historics.component.html',
  styleUrls: ['./historics.component.scss']
})
export class HistoricsComponent implements OnInit {

  seletedHistoric = null;
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public day = this.today.getDate();
  public initialHours: string = '00:00:00';
  public finalHours: string = '23:59:00';
  public initialDate: Date = new Date(this.year, this.month, this.day);
  public finalDate: Date = new Date(this.year, this.month, this.day);
  public events: any = [];
  public events$: Observable<any>;

  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
    public mapRequestService: MapRequestService,
    private _eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.getEvents();
  }

  async generateHistoric() {
    let data = {
      date_init: moment(this.initialDate).format('DD/MM/YYYY') + ' ' + this.initialHours,
      date_end: moment(this.finalDate).format('DD/MM/YYYY') + ' ' + this.finalHours,
      plates: this.mapFunctionalitieService.plateHistoric,
      events: this.mapFunctionalitieService.events,
      limit: 999,
      page: 1,
      fleet_presence: 0
    }
    console.log(data);
    await this.mapRequestService.getHistoric(data);
  }

  viewHistoric(plate) {
    if (this.seletedHistoric == plate) {
      this.seletedHistoric = null;
    } else {
      this.seletedHistoric = plate;
    }
  }

  convertDate(date) {
    return moment(this.initialDate).format('DD/MM/YYYY hh:mm:ss');
  }

  private getEvents(): void {
    this.events$ = this._eventsService.getEvents();
  }

}
