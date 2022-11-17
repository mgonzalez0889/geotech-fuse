import { Component, OnInit, EventEmitter } from '@angular/core';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';

@Component({
  selector: 'app-info-windows',
  templateUrl: './info-windows.component.html',
  styleUrls: ['./info-windows.component.scss']
})
export class InfoWindowsComponent implements OnInit {
  data: any;
  visible: number;
  onRefreshData = new EventEmitter();
  // refreshData() {
  //   this.onRefreshData.emit(this.data);
  // }

  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
  ) {
  }

  ngOnInit(): void {
    if (this.mapFunctionalitieService.type_geo === 'historic') {
      this.visible = 1;
    } else {
      this.visible = 2;
      this.data = this.mapFunctionalitieService.mobiles.filter(x => {
        return x.id === this.data.id
      })[0];
    }
  }
}
