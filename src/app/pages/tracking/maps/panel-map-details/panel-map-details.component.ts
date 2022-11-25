import { Component, OnInit } from '@angular/core';
import { MobileService } from 'app/core/services/mobile.service';
import { filter, mergeMap } from 'rxjs/operators';
import { MapToolsService } from '../../../../core/services/maps/map-tools.service';

@Component({
  selector: 'app-panel-map-details',
  templateUrl: './panel-map-details.component.html',
  styleUrls: ['./panel-map-details.component.scss']
})
export class PanelMapDetailsComponent implements OnInit {

  constructor(
    public mapService: MapToolsService,
    private mobilesService: MobileService
  ) { }

  ngOnInit(): void {
    this.mapService.selectPanelMap$
      .pipe(
        filter(({ data }) => !!data),
        mergeMap(({ data }) =>
          this.mobilesService.getDetailMobile(data.id)
        ))
      .subscribe((mobile) => {
        console.log('mobile', mobile);
      });
  }

}
