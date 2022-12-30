import { Component, OnDestroy, OnInit } from '@angular/core';
import { MobileService } from '@services/api/mobile.service';
import { MapToolsService } from '@services/maps/map-tools.service';
import { Subject } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';

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
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

// import { Component, OnInit } from '@angular/core';
// import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
// import { MobilesService } from 'app/core/services/mobiles/mobiles.service';
// import moment from 'moment';

// @Component({
//   selector: 'app-floating-menu-detail',
//   templateUrl: './floating-menu-detail.component.html',
//   styleUrls: ['./floating-menu-detail.component.scss'],
// })
// export class FloatingMenuDetailComponent implements OnInit {
//   public selectedState: number = 0;
//   public seleccionado = [];

//   constructor(
//     public mapFuncionalitieService: MapFunctionalitieService,
//     public mobileRequestService: MobilesService
//   ) { }

//   ngOnInit(): void { }

//   onChange(ev: any, item): any {
//     this.mapFuncionalitieService.goDeleteGeometryPath();
//     if (ev.checked) {
//       let shape = '["' + item.x + ' ' + item.y + '"]';
//       this.seleccionado.push({
//         ...item,
//         shape: shape,
//       });
//     } else {
//       const indx = this.seleccionado.findIndex((x) => x.id === item.id);
//       this.seleccionado.splice(indx, indx >= 0 ? 1 : 0);
//     }

//     this.mapFuncionalitieService.type_geo = 'punt';
//     for (let i = 0; i < this.seleccionado.length; i++) {
//       const element = this.seleccionado[i];
//       this.mapFuncionalitieService.createPunt(element);
//     }
//   }

//   convertDateHour(date) {
//     return moment(date).format('DD/MM/YYYY HH:mm:ss');
//   }
// }
