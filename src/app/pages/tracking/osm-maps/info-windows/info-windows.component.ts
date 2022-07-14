import { Component, OnInit, EventEmitter } from '@angular/core';
import moment from 'moment';
import { IconService } from 'app/core/services/icons/icon.service';
import { MapService } from 'app/core/services/maps/map.service';

@Component({
  selector: 'app-info-windows',
  templateUrl: './info-windows.component.html',
  styleUrls: ['./info-windows.component.scss']
})
export class InfoWindowsComponent implements OnInit {
  data: any;

  onRefreshData = new EventEmitter();
  // refreshData() {
  //   this.onRefreshData.emit(this.data);
  // }

  constructor(
    public mapService: MapService,
    private iconService: IconService
  ) {
    
  }

  ngOnInit(): void {
    this.iconService.loadIcons();
    console.log(this.mapService.dataInfoWindows);
    this.data = this.mapService.mobiles.filter(x=> {
      return x.id === this.data.id
    })[0];
  }

  convertDate(date) {
    return moment(date).fromNow();
  }

}
