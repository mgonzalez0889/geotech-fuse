import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  public markerClusterGroup: L.MarkerClusterGroup;
  public map: L.Map;
  public subscription: Subscription;
  public markers: any = {};
  constructor(
    private mobilesService: MobileService,
    private fleetService: FleetsService
  ) { }
}
