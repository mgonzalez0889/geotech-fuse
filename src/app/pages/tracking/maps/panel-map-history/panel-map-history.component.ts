import { Component, OnInit } from '@angular/core';
import { HistoriesService } from 'app/core/services/api/histories.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { DateTools } from 'app/core/tools/date.tool';

@Component({
  selector: 'app-panel-map-history',
  templateUrl: './panel-map-history.component.html',
  styleUrls: ['./panel-map-history.component.scss']
})
export class PanelMapHistoryComponent implements OnInit {
  public dataHistory: any = null;
  constructor(
    public mapService: MapToolsService,
    public toolDate: DateTools,
    private historicService: HistoriesService
  ) { }

  ngOnInit(): void {
    this.mapService.selectPanelMap$.subscribe(({ data }) => {
      this.dataHistory = data.dataHistory;
      this.historicService.getHistories(this.dataHistory).subscribe((his) => {
      });

      this.historicService.getHistoriesTrip(data.dataHistoryTrips).subscribe((trip) => {
      });
    });
  }

}


// import { Component, OnInit } from '@angular/core';
// import { EventsService } from 'app/core/services/events.service';
// import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
// import { MapRequestService } from 'app/core/services/request/map-request.service';
// import moment from 'moment';
// import { Observable, Subscription } from 'rxjs';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { FormReportComponent } from '../form-report/form-report.component';

// @Component({
//   selector: 'app-historics',
//   templateUrl: './historics.component.html',
//   styleUrls: ['./historics.component.scss'],
// })
// export class HistoricsComponent implements OnInit {
//   seletedHistoric = null;
//   public today = new Date();
//   public month = this.today.getMonth();
//   public year = this.today.getFullYear();
//   public day = this.today.getDate();
//   public initialHours: string = '00:00:00';
//   public finalHours: string = '23:59:00';
//   public initialDate: Date = new Date(this.year, this.month, this.day);
//   public finalDate: Date = new Date(this.year, this.month, this.day);
//   public events: any = [];
//   public events$: Observable<any>;
//   public seleccionado = [];
//   message_dates: boolean = false;

//   constructor(
//     public mapFunctionalitieService: MapFunctionalitieService,
//     public mapRequestService: MapRequestService,
//     private _eventsService: EventsService,
//     public dialog: MatDialog,
//   ) { }

//   ngOnInit(): void {
//     this.getEvents();
//   }

//   async generateHistoric(ev, trip) {
//     this.mapFunctionalitieService.type_historic = 'trip';

//     this.mapFunctionalitieService.goDeleteGeometryPath();
//     let data = {
//       date_init: moment(trip.fecha_inicial).format('DD/MM/YYYY HH:mm:ss'),
//       date_end: moment(trip.fecha_final).format('DD/MM/YYYY HH:mm:ss'),
//       plates: trip.plate,
//       events: -1,
//       limit: 99999999,
//       page: 1,
//       fleet_presence: 0,
//     };
//     console.log(data, 'null');

//     this.mapFunctionalitieService.type_geo = 'historic';
//     let response = await this.mapRequestService.getHistoric(data);
//     console.log(response, 'response');

//     if (ev.target.checked === false) {
//       this.mapFunctionalitieService.deleteChecks(response, 'delete');
//       // this.mapFunctionalitieService.map.removeLayer(this.mapFunctionalitieService.punt_geometry[data[0].data[0].id]);
//     } else {
//       this.mapFunctionalitieService.createHistoric(
//         null,
//         response,
//         trip.color
//       );
//       this.mapFunctionalitieService.createHistoric(
//         'punt',
//         trip,
//         trip.color
//       );
//     }
//   }

//   viewHistoric(plate) {
//     if (this.seletedHistoric == plate) {
//       this.seletedHistoric = null;
//     } else {
//       this.seletedHistoric = plate;
//     }
//   }

//   convertDateHour(date) {
//     return moment(this.initialDate).format('DD/MM/YYYY hh:mm:ss');
//   }

//   private getEvents(): void {
//     this.events$ = this._eventsService.getEvents();
//   }

//   selectAll(ev, plate, color) {
//     for (
//       let j = 0;
//       j < this.mapFunctionalitieService.historic.length;
//       j++
//     ) {
//       this.mapFunctionalitieService.historic[j].data
//         .filter((x) => {
//           return x.plate === plate;
//         })
//         .map((x) => {
//           x.selected = ev.checked;
//           return x;
//         });
//     }
//     let data = this.mapFunctionalitieService.historic.filter((x) => {
//       return x.plate === plate;
//     });
//     this.mapFunctionalitieService.type_geo = 'historic';

//     if (ev.checked === false) {
//       this.mapFunctionalitieService.deleteChecks(data[0].data, 'delete');
//       this.mapFunctionalitieService.map.removeLayer(
//         this.mapFunctionalitieService.punt_geometry[data[0].data[0].id]
//       );
//     } else {
//       this.mapFunctionalitieService.createHistoric(
//         null,
//         data[0].data,
//         color
//       );
//     }
//   }

//   onChange(ev, item) {
//     if (ev.checked) {
//       this.seleccionado.push(item);
//     } else {
//       const indx = this.seleccionado.findIndex((x) => x.id === item.id);
//       this.seleccionado.splice(indx, indx >= 0 ? 1 : 0);
//     }

//     this.mapFunctionalitieService.type_geo = 'historic';
//     // this.mapFunctionalitieService.createPunt(null, this.seleccionado);
//   }
// }
