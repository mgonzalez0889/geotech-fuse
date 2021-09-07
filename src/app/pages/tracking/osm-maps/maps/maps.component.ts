import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {Observable, Subscriber, Subscription} from "rxjs";
import {MobileService} from "../../../../core/services/mobile.service";
import {HelperService} from "../../../../core/services/helper.service";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {
  private map: L.Map;
  @ViewChild('map') divMaps: ElementRef;
  public subscription: Subscription;
  public devices: any = [];
  public markers: any = [];
  public markersInit: any = [];
  public markersAll: any = [];

  constructor(
      private mobilesService: MobileService,
  ) { }

  ngOnInit(): void {
      this.getDevices();
  }

 /* public onDataDevice(data: []): void {
      this.devices = data;
  }*/

  public onValue(value): void {
      // console.log(value);
      this.addMarker(value);
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
      });
      tiles.addTo(this.map);

    /*  const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          minZoom: 10,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });*/
      //tiles.addTo(this.map);
      // L.marker([4.658383846282959, -74.09394073486328]).addTo(this.map);
      this.getCurrentPosition().subscribe((position: any) => {
          this.map.flyTo([position.latitude, position.longitude], 13);

          /*const marker = L.marker([position.latitude, position.longitude],  ).bindPopup('Angular Leaflet');
          marker.addTo(this.map);*/
      });
  }

  public addMarker(markers): void {
      if (markers.length) {
          let myLatLng: any = {lat: '', lng: ''};
          let title: string;
          let mark: L.Marker;
          this.markersAll.forEach(t => {
              t.remove();
          });
          markers.forEach(m => {
              if (m.selected) {
                  console.log(m.selected);
                  this.markers.push(m);
                  const value = this.markersAll.hasOwnProperty(m.id);
                  console.log(m);
                  console.log(value);
              }else {
                  const index = this.markers.indexOf(m);
                  console.log(index);
                  if (index > -1) {
                      this.markers.splice(index, 1);
                  }
              }
          });
          console.log(this.markers);
          this.setMarkers(this.markers);
      }
      if(!this.markers.length) {
          this.getDevices();
      }
  }
  /**
   * @description: Metodo que identifica la posicion actual
   */
  private getCurrentPosition(): any {
      return new Observable((observer: Subscriber<any>) => {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position: any) => {
                  observer.next({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                  });
                  observer.complete();
              });
          }else {
              observer.error();
          }
      });
  }
  /**
   * @description: Obtiene todos los dispositivos
   */
  private getDevices(): void {
      this.subscription = this.mobilesService.getMobiles().subscribe(({data}) => {
          console.log(data);
          this.setMarkers(data);
      });
  }
  /**
   * @description: Muestra los marcadores en el mapa desde el inicio
   */
  private setMarkers(markers) {
      if (markers) {
          let myLatLng: any = {lat: '', lng: ''};
          let title: string;
          let mark: L.Marker;
          markers.forEach(m => {
              myLatLng = {
                  lat: Number(m.y),
                  lng: Number(m.x)
              };
              title = m.plate;
              this.markersAll[m.id] = L.marker([myLatLng.lat, myLatLng.lng]).addTo(this.map);
              // this.markersInit.push(mark);
          });
          console.log(this.markersAll);
      }
  }

  ngAfterViewInit(): void {
      this.initMap();
  }

}
