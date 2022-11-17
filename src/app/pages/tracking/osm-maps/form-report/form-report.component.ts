import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import moment from 'moment';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import { EventsService } from 'app/core/services/events.service';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit {
  seletedHistoric = null;
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public day = this.today.getDate();
  public initialHours: string = '00:00:00';
  public finalHours: string = '23:59:00';
  public initialDate: Date = new Date();
  public finalDate: Date = new Date();
  public events: any = [];
  public events$: Observable<any>;
  public seleccionado = [];
  message_dates: boolean = false;

  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
    private mapRequestService: MapRequestService,
    private _eventsService: EventsService
  ) { }

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents(): void {
    this.events$ = this._eventsService.getEvents();
  }

  setFilter() {
    var fechaInicio = new Date(
      moment(this.initialDate).format('DD/MM/YYYY')
    ).getTime();
    var fechaFin = new Date(
      moment(this.finalDate).format('DD/MM/YYYY')
    ).getTime();

    var diff = fechaFin - fechaInicio;

    if (Number(diff / (1000 * 60 * 60 * 24)) > 30) {
      this.message_dates = true;
    } else {
      this.message_dates = false;
    }
  }

  async onSelect() {
    this.mapFunctionalitieService.type_historic = 'historic';

    let data = {
      date_init:
        moment(this.initialDate).format('DD/MM/YYYY') + ' 00:00:00',
      date_end: moment(this.finalDate).format('DD/MM/YYYY') + ' 23:59:59',
      plates: this.mapFunctionalitieService.plateHistoric,
      events: [8],
      limit: 999999999,
      page: 1,
      validationFleet: 0,
    };

    let dataTrip = {
      date_init:
        moment(this.initialDate).format('DD-MM-YYYY') + ' 00:00:00',
      date_end: moment(this.finalDate).format('DD-MM-YYYY') + ' 23:59:59',
      plates: this.mapFunctionalitieService.plateHistoric,
    };

    await this.mapRequestService.getHistoric(data);
    await this.mapRequestService.getHistoricTrip(dataTrip);
    this.mapFunctionalitieService.showHistoricPlate = true;
  }
}
