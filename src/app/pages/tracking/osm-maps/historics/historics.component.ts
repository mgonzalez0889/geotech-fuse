import { Component, OnInit } from '@angular/core';
import { EventsService } from 'app/core/services/events.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import moment from 'moment';
import { Observable, Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { FormReportComponent } from '../form-report/form-report.component';
import { SettingsService } from 'app/core/services/settings.service';

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
  public seleccionado = [];
  message_dates: boolean = false;

  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
    public mapRequestService: MapRequestService,
    private _eventsService: EventsService,
    public dialog: MatDialog,
    public settingService: SettingsService
  ) { }

  ngOnInit(): void {
    this.getEvents();
  }

  async generateHistoric() {
    this.mapFunctionalitieService.goDeleteGeometryPath();
    let data = {
      date_init: moment(this.initialDate).format('DD/MM/YYYY') + ' ' + this.initialHours,
      date_end: moment(this.finalDate).format('DD/MM/YYYY') + ' ' + this.finalHours,
      plates: this.mapFunctionalitieService.plateHistoric,
      events: this.mapFunctionalitieService.events,
      limit: 999,
      page: 1,
      fleet_presence: 0
    }
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

  setFilter() {
    var fechaInicio = new Date(moment(this.initialDate).format('YYYY-MM-DD')).getTime();
    var fechaFin = new Date(moment(this.finalDate).format('YYYY-MM-DD')).getTime();

    var diff = fechaFin - fechaInicio;

    if (Number(diff / (1000 * 60 * 60 * 24)) > 30) {
      this.message_dates = true;
    } else {
      this.message_dates = false;
    }

  }

  selectAll(ev, plate, color) {
    for (let j = 0; j < this.mapFunctionalitieService.historic.length; j++) {
      this.mapFunctionalitieService.historic[j].data.filter(x => {
        return x.plate === plate;
      }).map(x => {
        x.selected = ev.checked;
        return x
      });
    }
    let data = this.mapFunctionalitieService.historic.filter(x => {
      return x.plate === plate;
    });
    this.mapFunctionalitieService.type_geo = 'historic';

    if (ev.checked === false) {
      this.mapFunctionalitieService.deleteChecks(data[0].data, 'delete');
      this.mapFunctionalitieService.map.removeLayer(this.mapFunctionalitieService.punt_geometry[data[0].data[0].id]);

    } else {
      this.mapFunctionalitieService.createPunt(null, data[0].data, color);
    }
  }

  onChange(ev, item) {
    if (ev.checked) {
      this.seleccionado.push(item);
    } else {
      const indx = this.seleccionado.findIndex(x => x.id === item.id);
      this.seleccionado.splice(indx, indx >= 0 ? 1 : 0);
    }

    this.mapFunctionalitieService.type_geo = 'historic';
    this.mapFunctionalitieService.createPunt(null, this.seleccionado);
  }

  filters() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(FormReportComponent, dialogConfig);
  }

}
