import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MarkerClusterGroup } from 'leaflet';
import * as L from 'leaflet';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import moment from 'moment';

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
    ) {}

    ngOnInit(): void {
    }
}
