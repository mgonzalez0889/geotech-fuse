import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {Subscription} from "rxjs";
import {MobileService} from "../../../../core/services/mobile.service";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  @ViewChild('map') divMaps: ElementRef;
  private centroid: L.LatLngExpression = [42.3601, -71.0589];
  public subscription: Subscription;

  constructor(
      private mobilesService: MobileService
  ) { }

  ngOnInit(): void {
      this.getMobiles();

  }

  private initMap(): void {
      const myLatLng: L.LatLngExpression = [4.658383846282959, -74.09394073486328];
      this.map = L.map(this.divMaps.nativeElement, {
          center: myLatLng,
          zoom: 15,
      });

      const tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://cloudmade.com">CloudMade</a>',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }).addTo(this.map);

    /*  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 10,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });*/
      tiles.addTo(this.map);
  }

  ngAfterViewInit(): void {
      this.initMap();
  }

  private getMobiles(): void {
      this.subscription = this.mobilesService.getMobiles().subscribe(res => {
          console.log(res);
      });
  }

}
