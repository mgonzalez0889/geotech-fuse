import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {Observable, Subscriber, Subscription} from 'rxjs';
import {MobileService} from '../../../../core/services/mobile.service';
import {HistoriesService} from '../../../../core/services/histories.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  providers: [DatePipe]
})
export class MapsComponent implements OnInit, AfterViewInit, OnDestroy {
  private map: L.Map;
  @ViewChild('map') divMaps: ElementRef;
  public subscription: Subscription;
  public markers: any = [];
  public markersAll: any = [];
  public showHistory: boolean;
  public layerGroup: any = [];

  constructor(
      private mobilesService: MobileService,
      private historyService: HistoriesService,
      private datePipe: DatePipe
  ) { }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

  ngOnInit(): void {
      this.getDevices();
      this.listenObservables();
      this.listenDataObservable();
  }

  public onCloseMenu(event): void {
      this.showHistory = event;
  }

 /* public onDataDevice(data: []): void {
      this.devices = data;
  }*/

  public onValue(value): void {
      this.addMarker(value);
  }
  private initMap(): void {
      const myLatLng: L.LatLngExpression = [4.658383846282959, -74.09394073486328];
      this.map = L.map(this.divMaps.nativeElement, {
          center: myLatLng,
          zoom: 15,
          // zoomControl: false
      });
      this.map.zoomControl.setPosition('bottomright');

      const tiles = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://cloudmade.com">CloudMade</a>',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
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
  /**
   * @description: Adiciona marcadores al inicio
   */
  public addMarker(markers): void {
      if (markers.length) {
          this.markersAll.forEach(t => {
              t.remove();
          });
          markers.forEach(m => {
              if (m.selected) {
                  this.markers.push(m);
                  // const value = this.markersAll.hasOwnProperty(m.id);
              }else {
                  const index = this.markers.indexOf(m);
                  console.log(index);
                  if (index > -1) {
                      this.markers.splice(index, 1);
                  }
              }
          });
          console.log(this.markers);
          this.historyService.subjectHistories.next({payload: this.markers});
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
          this.setMarkers(data);
      });
  }
  /**
   * @description: Muestra los marcadores en el mapa desde el inicio
   */
  private setMarkers(markers): void {
      if (markers) {
          let myLatLng: any = {lat: '', lng: ''};
          let title: string;
          markers.forEach(m => {
              myLatLng = {
                  lat: Number(m.y),
                  lng: Number(m.x)
              };
              title = m.plate;
              this.markersAll[m.id] = L.marker([myLatLng.lat, myLatLng.lng]).addTo(this.map);
              // this.markersInit.push(mark);
          });
          // console.log(this.markersAll);
      }
  }

  private listenObservables(): void {
      this.subscription = this.historyService.subjectDataHistories.subscribe(({show}) => {
          if (show) {
              this.showHistory = show;
          }
      });
  }
  /**
   * @description: Escucha el observable data para marcador
   */
  private listenDataObservable(): void {
      this.subscription = this.historyService.subjectDataSelected.subscribe(({payload, select}) => {
          if (select) {
            const {color_line} = payload;
              // this.markAndPolyline(payload);
              let myLatLng: any = [];
              let marker: any = {lat: '', lng: ''};
              let bindTooltip: string;
              let mark: L.Marker;
              let layerGroup: L.LayerGroup = new L.LayerGroup();
              const customIcon = new L.Icon({
                  iconUrl: '/assets/icons/markerblue.svg',
                  iconSize: [45, 61],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
              });
              payload.time_line.forEach((m) => {
                  myLatLng.push([Number.parseFloat(m.x), Number.parseFloat(m.y)]);
                  // console.log(m.x, m.y);
                  marker = {
                      lat: Number(m.x),
                      lng: Number(m.y)
                  };
                  // console.log(marker);
                  bindTooltip = `
                    <h2 class="'semibold'">${payload.plate}</h2>
                    <P class="'extralight'">
                        Dirección: ${m.address}
                    </P>
                    <P class="'extralight'">
                        Evento: ${m.event_name}
                    </P>
                    <P class="'extralight'">
                        Fecha de Evento: ${this.datePipe.transform(m.date_event, 'medium')}
                    </P>
                    `;
                  mark = L.marker([marker.lat, marker.lng],
                      {icon: customIcon})
                      .bindTooltip(bindTooltip, {direction: 'auto'}).addTo(this.map);
                  layerGroup.addLayer(mark).addTo(this.map);
                  // console.log(layerGroup);
              });
              // console.log('POLYLINE');
              // console.log(myLatLng);
              const polyline: L.Polyline =  L.polyline(myLatLng, {color: color_line, weight: 5});
              layerGroup.addLayer(polyline).addTo(this.map);
              this.layerGroup.push({id: payload.plate, layerGroup});
              // console.log(this.layerGroup);
          }else {
              const layer = this.layerGroup.find(t => t.id == payload.plate);
              const index = this.layerGroup.indexOf( layer );
              this.layerGroup.splice( index, 1 );
              // console.log(layer?.layerGroup);
              layer?.layerGroup.clearLayers();
          }
      });
  }
  /**
   * @description: Metodo que marca y traza una polilinea
   */
  private markAndPolyline(mark): void {
      console.log(mark);
      mark.time_line.forEach(m => {
          L.marker(m.x, m.y).addTo(this.map);
      });
  }

  private addIcon(engine, orientation) {
      let icon: L.Icon;


  }

  ngAfterViewInit(): void {
      this.initMap();
  }

}
