import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import * as R from 'leaflet-marker-rotation';
import {Observable, Subscriber, Subscription} from 'rxjs';
import {MobileService} from '../../../../core/services/mobile.service';
import {HistoriesService} from '../../../../core/services/histories.service';
import {DatePipe} from '@angular/common';
import {MobilesInterface} from '../../../../core/interfaces/mobiles.interface';
import {FleetsService} from "../../../../core/services/fleets.service";
import {FleetInterface} from "../../../../core/interfaces/fleets.interface";

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
  public markers: MobilesInterface[] = [];
  public markersAll: L.Marker[] = [];
  public showHistory: boolean;
  public layerGroup: any = [];
  public showMenuFleet: boolean = false;
  public showMenuMobiles: boolean = true;
  public markersFleet: L.Marker[] = [];

  constructor(
      private mobilesService: MobileService,
      private historyService: HistoriesService,
      private datePipe: DatePipe,
      private fleetService: FleetsService
  ) { }

  ngOnInit(): void {
      this.getDevices();
      this.listenObservables();
      this.listenDataObservable();
      this.listenObservableCloseModal();
      this.listenObservableMenuFleet();
      this.listenObservableMenuMobile();
      this.listenObservableFleetPlate();
  }

  public onCloseMenu(event): void {
      this.showHistory = event;
  }
  /**
   * @description: Recibe data y envia al metodo addMarker
   */
  public onValue(value: MobilesInterface[]): void {
      this.addMarker(value);
  }
  /**
   * @description: Inicializacion del mapa
  */
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
  public addMarker(markers: MobilesInterface[]): void {
      if (markers.length) {
          this.markersAll.forEach((t) => {
              t.remove();
          });
          markers.forEach((m) => {
              if (m.selected) {
                  this.markers.push(m);
                  // const value = this.markersAll.hasOwnProperty(m.id);
              }else {
                  const index = this.markers.indexOf(m);
                  // console.log(index);
                  if (index > -1) {
                      this.markers.splice(index, 1);
                  }
              }
          });
          // console.log(this.markers);
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
  private setMarkers(markers: MobilesInterface[]): void {
      if (markers) {
          let myLatLng: any = {lat: '', lng: ''};
          let title: string;
          const iconStop = new L.Icon({
              iconUrl: '/assets/icons/punt-01.svg',
              iconSize: [55, 71],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
          });
          // const iconStop: any = '/assets/icons/arrow-01.svg';
          let iconArrow: string = '/assets/icons/arrow-01.svg';
          let customIcon: L.Icon;
          markers.forEach((m) => {
              myLatLng = {
                  lat: Number(m.y),
                  lng: Number(m.x)
              };
              title = m.plate;
              // eslint-disable-next-line max-len
              console.log(customIcon);
              iconArrow =
                  'data:image/svg+xml;utf-8,' + encodeURIComponent('<?xml version="1.0" encoding="utf-8"?>\n' +
                  '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
                  '\t viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve">\n' +
                  '<style type="text/css">\n' +
                  '\t.st0{fill:'+ m.color +';}\n' +
                  '\t.st1{fill:'+ m.color +';}\n' +
                  '</style>\n' +
                  '<g>\n' +
                  '\t<polygon class="st0" points="100,141.1 63.4,153.7 100.4,46 \t"/>\n' +
                  '\t<polygon class="st1" points="100,141.1 136.6,154 100.4,46 \t"/>\n' +
                  '</g>\n' +
                  '</svg>\n ');
              customIcon = new L.Icon({
                  iconUrl: iconArrow,
                  iconSize: [55, 71],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
              });
              // console.log(iconArrow);
              this.markersAll[m.id] = new R.RotatedMarker([myLatLng.lat, myLatLng.lng],
                  {rotationAngle: Number(m.heading),
                           rotationOrigin: 'bottom center',
                           icon: customIcon })
                  .addTo(this.map);

              // this.markersAll[m.id] = L.marker([myLatLng.lat, myLatLng.lng]).addTo(this.map);
              // this.markersInit.push(mark);
          });
          // console.log(this.markersAll);
      }
  }
  /**
   * @description: Escucha el observable
   */
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
   * @description: Escucha el observable fleet plate
   */
  private listenObservableFleetPlate(): void {
      this.subscription = this.fleetService.behaviorSelectedFleetPlate$.subscribe(({payload, selected}) => {
          if (selected) {
            console.log(payload);
            let mark: L.Marker;
            let myLatLng: any = {lat: '', lng: ''};
            payload.forEach((m) => {
                myLatLng = {
                    lat: Number(m.x),
                    lng: Number(m.y)
                };
                mark = L.marker([myLatLng.lat, myLatLng.lng]).addTo(this.map);

            });
          }else {
              console.log('Seleccione');
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
  /**
   * @description: Escucha el observable Event de Histories
   */
  private listenObservableCloseModal(): void {
      this.subscription = this.historyService.eventShowModal$.subscribe(({show}) => {
          if (show) {
              this.layerGroup.forEach((t) => {
                  t.layerGroup.clearLayers();
              });
              this.layerGroup = [];
          }
      });
  }
  /**
   * @description: Escucha el observable Menu FLoating Fleet
   */
  private listenObservableMenuFleet(): void {
      this.subscription = this.historyService.floatingMenuFleet$.subscribe((show) => {
          if (show) {
              this.showMenuFleet = show;
              this.showMenuMobiles = !show;
              this.markersAll.forEach((t) => {
                  t.remove();
              });
          }
      });
  }
  /**
   * @description: Escucha el observable Menu Floating Mobiles
   */
  private listenObservableMenuMobile(): void {
      this.subscription = this.historyService.floatingMenuMobile$.subscribe((show) => {
          if (show) {
              this.showMenuMobiles = show;
              this.showMenuFleet = !show;
              this.getDevices();
          }
      });
  }


  ngAfterViewInit(): void {
      this.initMap();
  }

  ngOnDestroy(): void {
     this.subscription.unsubscribe();
  }

}
