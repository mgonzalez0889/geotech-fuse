import { Component, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from 'app/core/services/mobile.service';
import { Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { MapToolsService } from '../../../../core/services/maps/map-tools.service';

@Component({
  selector: 'app-panel-map-details',
  templateUrl: './panel-map-details.component.html',
  styleUrls: ['./panel-map-details.component.scss']
})
export class PanelMapDetailsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
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
        ),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((mobile) => {
        console.log('mobile', mobile);
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
