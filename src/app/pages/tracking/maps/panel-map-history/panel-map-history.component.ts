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

      console.log('histori', data);
      this.dataHistory = data.dataHistory;
      this.historicService.getHistories(this.dataHistory).subscribe((his) => {

        console.log('his', his);


      });

      this.historicService.getHistoriesTrip(data.dataHistoryTrips).subscribe((trip) => {


        console.log('trips', trip);

      });


    });
  }

}
