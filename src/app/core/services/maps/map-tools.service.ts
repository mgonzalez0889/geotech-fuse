/* eslint-disable max-len */
import * as L from 'leaflet';
import moment from 'moment';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import 'leaflet.fullscreen';
import 'leaflet-routing-machine';
import 'leaflet.marker.slideto';
import 'leaflet-hotline';
import { Subject, BehaviorSubject } from 'rxjs';
import { PopupMapComponent } from '../../../pages/tracking/maps/popup-map/popup-map.component';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { IOptionPanelGeotools, IOptionPanelMap } from '@interface/index';

@Injectable({
  providedIn: 'root',
})
export class MapToolsService {
  public verLabel: boolean = true;
  public verCluster: boolean = true;
  public compRef: ComponentRef<PopupMapComponent>;
  public mobileSocket$: Subject<any> = new Subject();
  public selectPanelMap$: BehaviorSubject<IOptionPanelMap> = new BehaviorSubject({ panel: 'none', data: null });
  public selectPanelGeoTools$: Subject<IOptionPanelGeotools> = new Subject();
  public shapeData$: Subject<string[]> = new Subject();
  private zoom: number = 11;
  private countPointId = 0;
  private shapeGeo: string[] = [];
  private latlng: { lat: number; lng: number }[] = [];
  private map: L.Map;
  private markerCluster = L.markerClusterGroup();
  private marker = {};
  private markers: any = {};
  private markersPoint: any = {};
  private markersRoutes: any = {};
  private markersZones: any = {};
  private pointLatLens: any[] = [];
  private popup = L.popup({
    closeButton: false,
    keepInView: true,
    maxWidth: 300,
  });

  constructor(
    private injector: Injector,
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver,
  ) {
    this.getPosition().then(({ lat, lng }) => {
      this.map.options.center = [lat, lng];
    });
  }

  /**
   * @description: Se inicializa el mapa
   */
  public initMap(optionsMap: L.MapOptions): void {
    const GoogleMaps = L.tileLayer(
      'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        minZoom: 3,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );
    const GoogleHybrid = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        minZoom: 3,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );
    const OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      {
        maxZoom: 20,
        minZoom: 3,
      }
    );

    const baseLayers: L.Control.LayersObject = {
      GoogleMaps,
      GoogleHybrid,
      OpenStreetMap
    };

    this.map = L.map('map', {
      zoomAnimation: true,
      layers: [GoogleMaps],
      inertia: true,
      worldCopyJump: true,
      ...optionsMap,
    });
    this.map.on('zoom', (data) => {
      this.zoom = data.target.getZoom();
    });
    this.zoom = this.map.getZoom();
    L.control.layers(baseLayers, {}, { position: optionsMap.fullscreenControlOptions.position }).addTo(this.map);
  }

  /**
   * @description: Crea un solo marcador en el mapa
   */
  public setMarker(mobile: any): void {
    this.marker[mobile.id] = new L.Marker([mobile.x, mobile.y], {
      icon: this.setIcon(mobile),
    });
    this.marker[mobile.id].options.rotationAngle =
      this.rotationIcon(mobile);
    this.marker[mobile.id].bindTooltip(mobile.plate, {
      permanent: true,
      direction: 'bottom',
      offset: L.point({ x: 0, y: 18 }),
    });
    this.marker[mobile.id].addTo(this.map);
    this.map.fitBounds([this.marker[mobile.id].getLatLng()]);
  }

  /**
   * @description: Se crea los marcadores de los vehiculos en el mapa
   */
  public setMarkers(
    mobiles: any[],
    popup: boolean = false
  ): void {
    mobiles.forEach((data: any) => {
      this.markers[data.id] = new L.Marker([data.x, data.y], {
        icon: this.setIcon(data),
        title: data.plate
      });

      this.makerBindTooltip(this.verLabel);

      if (this.verCluster) {
        this.markers[data.id].addTo(this.markerCluster);
        this.markerCluster.addTo(this.map);
      } else {
        this.markers[data.id].addTo(this.map);
      }

      if (popup) {
        this.makePopup(data);
      }

      this.pointLatLens.push(
        Object.values(this.markers[data.id].getLatLng())
      );

      this.markers[data.id].options.rotationAngle =
        this.rotationIcon(data);
    });

    this.map.fitBounds(this.pointLatLens, {});
  }

  /**
   * @description: Asigna los iconos para el marcador deacuerdo al estado
   * @param data - informacion del vehiculo
   */
  public setIcon(data: any): L.Icon<L.IconOptions> {
    const typeService = data?.class_mobile_name?.toLowerCase() || 'vehicular';

    const diffDays = moment(new Date()).diff(
      moment(data.date_entry),
      'days'
    );

    if (diffDays >= 1 || isNaN(diffDays)) {
      return L.icon({
        iconUrl: '../assets/icons/iconMap/no_report.svg',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5],
      });
    }

    if (Number(data.status) === 0 && Number(data.speed) === 0) {
      if (typeService === 'geobolt') {
        return L.icon({
          iconUrl: './assets/icons/iconMap/status_open_color.svg',
          iconSize: [25, 25],
          iconAnchor: [12.5, 12.5],
        });
      } else if (typeService === 'vehicular' || typeService === 'telemetria') {
        return L.icon({
          iconUrl: '../assets/icons/iconMap/engine_shutdown.svg',
          iconSize: [25, 25],
          iconAnchor: [12.5, 12.5],
        });
      }
    } else {
      if (Number(data.speed) === 0) {
        if (typeService === 'geobolt') {
          return L.icon({
            iconUrl: './assets/icons/iconMap/status_close_color.svg',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5],
          });
        } else if (typeService === 'vehicular' || typeService === 'telemetria') {
          return L.icon({
            iconUrl:
              '../assets/icons/iconMap/engine_ignition.svg',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5],
          });
        }
      }
    }

    if (Number(data.speed) > 0) {
      return L.icon({
        iconUrl: '../assets/icons/iconMap/arrow.svg',
        iconSize: [36, 36],
        iconAnchor: [10, 10],
      });
    }

    return L.icon({
      iconUrl: '../assets/icons/iconMap/no_report.svg',
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5],
    });
  }

  /**
   * @description: mueve el icono si el vehiculo esta en movimiento
   * @param data - informacion del vehiculo
   */
  public moveMakerSelect(data: any): void {
    if (this.marker[data.id_mobile]) {
      this.marker[data.id_mobile].slideTo([data.x, data.y], {
        duration: 2000,
        icon: this.setIcon(data),
        keepAtCenter: true
      });
      this.marker[data.id_mobile].options.rotationAngle =
        this.rotationIcon(data);
      this.marker[data.id_mobile].setIcon(this.setIcon(data));
    }
  }

  /**
   * @description: Realiza el cambio de orientacion de los iconos del mapa
   * @param data - informacion del vehiculo
   */
  public moveMarker(data: any): void {
    // .slideCancel()
    if (this.markers.hasOwnProperty(data.id_mobile)) {
      this.markers[data.id_mobile].slideTo([data.x, data.y], {
        duration: 2000,
        icon: this.setIcon(data),
      });
      this.markers[data.id_mobile].options.rotationAngle =
        this.rotationIcon(data);
      this.markers[data.id_mobile].setIcon(this.setIcon(data));
    }
  }

  /**
   * @description: Crea un punto en el mapa
   */
  public createPoint(): void {
    this.clearMap();
    this.map.getContainer().style.cursor = 'crosshair';
    this.map.on('click', (e) => {
      const idPoint = 999999;
      const shape = [];
      const latlng = this.map.mouseEventToLatLng(e.originalEvent);

      if (this.markersPoint[idPoint]) {
        this.map.removeLayer(this.markersPoint[idPoint]);
      }
      this.map.setView([latlng.lat, latlng.lng], this.zoom);
      this.markersPoint[idPoint] = L.marker(
        [latlng.lat, latlng.lng],
        {
          icon: L.icon({
            iconUrl: '../assets/icons/iconMap/punt.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          }),
        }
      );
      shape.push(`${latlng.lat} ${latlng.lng}`);
      this.shapeData$.next(shape);
      this.markersPoint[idPoint].addTo(this.map);
    });
  }

  /**
   * @description: Crea una zona o una ruta en el mapa
   * @param type - tipo puede ser rutas o zonas
   */
  createGeometry(type: string): void {
    this.clearMap();
    this.map.getContainer().style.cursor = 'crosshair';

    this.map.on('click', (e) => {
      const latlng = this.map.mouseEventToLatLng(e.originalEvent);
      this.latlng.push(latlng);
      this.countPointId++;
      this.shapeGeo.push(`${latlng.lat} ${latlng.lng}`);
      this.map.setView([latlng.lat, latlng.lng], this.zoom);
      if (type === 'routes') {
        this.markersRoutes[this.countPointId] = L.polyline(
          [this.latlng],
          {
            color: 'blue',
            weight: 5,
          }
        );
        this.markersRoutes[this.countPointId].addTo(this.map);
      } else if (type === 'zones') {
        this.markersZones[this.countPointId] = L.polygon([this.latlng], {
          color: 'blue',
          weight: 5,
        });
        this.markersZones[this.countPointId].addTo(this.map);
      }
      this.shapeData$.next(this.shapeGeo);
    });
  }

  public deleteEventMap(event: string = 'click'): void {
    this.map.removeEventListener(event);
  }

  /**
   * @description: muestra o quita la e
   * @param layer - informacion del punto, ruta o zona en el mapa
   */
  public makerBindTooltip(check: boolean): void {
    for (const point in this.markers) {
      if (this.markers.hasOwnProperty(point)) {
        const data = this.markers[point];
        if (check) {
          this.markers[point].bindTooltip(data.options.title, {
            permanent: true,
            direction: 'bottom',
            offset: L.point({ x: 0, y: 18 }),
          });
        } else {
          this.markers[point].unbindTooltip();
        }
      }
    }
  }

  /**
   * @description:Limpia todo lo que contenga el mapa
   */
  public clearMap(): void {
    for (const point in this.markers) {
      if (this.markers.hasOwnProperty(point)) {
        this.map.removeLayer(this.markers[point]);
      }
    }

    for (const pointView in this.markersPoint) {
      if (this.markersPoint.hasOwnProperty(pointView)) {
        this.map.removeLayer(this.markersPoint[pointView]);
      }
    }

    for (const pointView in this.markersZones) {
      if (this.markersZones.hasOwnProperty(pointView)) {
        this.map.removeLayer(this.markersZones[pointView]);
      }
    }

    for (const pointView in this.markersRoutes) {
      if (this.markersRoutes.hasOwnProperty(pointView)) {
        this.map.removeLayer(this.markersRoutes[pointView]);
      }
    }

    this.countPointId = 0;
    this.latlng = [];
    this.shapeGeo = [];
    this.pointLatLens = [];
    this.markerCluster.clearLayers();
  }

  /**
   * @description: Muestra los puntos seleccionado en el mapa
   * @param layer - informacion del punto, ruta o zona en el mapa
   * @param type - tipo puede ser punto, rutas o zonas
   */
  public removeLayer(layer: any, type: string): void {
    this.map.getContainer().style.cursor = 'grab';
    switch (type) {
      case 'routes':
        if (this.markersRoutes[layer.id]) {
          this.map.removeLayer(this.markersRoutes[layer.id]);
        }
        break;
      case 'punts':
        if (this.markersPoint[layer.id]) {
          this.map.removeLayer(this.markersPoint[layer.id]);
        }
        break;
      case 'zones':
        if (this.markersZones[layer.id]) {
          this.map.removeLayer(this.markersZones[layer.id]);
        }
        break;
    }
  }

  /**
   * @description: Muestra los puntos seleccionado en el mapa
   * @param data - informacion del vehiculo
   */
  public viewPoint(data: any): void {
    const iconUrl = 'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19C5.73693 17.9227 4.56619 16.7416 3.5 15.4691C1.9 13.5581 8.83662e-07 10.712 8.83662e-07 8.00005C-0.00141728 5.1676 1.70425 2.61344 4.32107 1.52945C6.93789 0.445455 9.95007 1.04529 11.952 3.04905C13.2685 4.35966 14.0059 6.14244 14 8.00005C14 10.712 12.1 13.5581 10.5 15.4691C9.43382 16.7416 8.26307 17.9227 7 19ZM7 5.00005C5.92821 5.00005 4.93782 5.57185 4.40193 6.50005C3.86603 7.42825 3.86603 8.57185 4.40193 9.50005C4.93782 10.4283 5.92821 11.0001 7 11.0001C8.65686 11.0001 10 9.6569 10 8.00005C10 6.3432 8.65686 5.00005 7 5.00005Z" fill="' +
        data.color +
        '"/></svg>'
      );
    const [shape]: string[] = JSON.parse(data.shape);
    const x = Number(shape.split(' ')[0]);
    const y = Number(shape.split(' ')[1]);

    this.map.setView([x, y], this.zoom);
    this.markersPoint[data.id] = L.marker([x, y], {
      icon: L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })
    });

    this.markersPoint[data.id].addTo(this.map);
  }

  /**
   * @description: Muestra las rutas seleccionada en el mapa
   * @param data - informacion del vehiculo
   */
  public viewRoutes(data: any): void {
    if (data.shape === 'x, y') { return; }
    const shape: string[] = JSON.parse(data.shape);

    const arrayPointRoute = shape.map((position) => {
      const x = Number(position.split(' ')[0]);
      const y = Number(position.split(' ')[1]);
      return { lat: x, lng: y };
    });

    this.map.setView([arrayPointRoute[0].lat, arrayPointRoute[0].lng], 13);

    this.markersRoutes[data.id] = L.polyline(arrayPointRoute, {
      color: data.color,
      weight: 6
    });
    this.markersRoutes[data.id].addTo(this.map);
  }

  /**
   * @description: Muestra la zona seleccionada en el mapa
   * @param data - informacion del vehiculo
   */
  public viewZones(data: any): void {
    if (!data.shape) { return; }

    const shape: string[] = JSON.parse(data.shape);
    const arrayPointRoute = shape.map((position) => {
      const x = Number(position.split(' ')[0]);
      const y = Number(position.split(' ')[1]);
      return { lat: x, lng: y };
    });

    this.map.setView([arrayPointRoute[0].lat, arrayPointRoute[0].lng], this.zoom);

    this.markersZones[data.id] = L.polygon(arrayPointRoute, {
      color: data.color,
      weight: 5
    });
    this.markersZones[data.id].addTo(this.map);
  }

  /**
   * @description: Se encarga de construir el componente que muestra el detalle del vehiculo en el mapa
   * @param data - informacion del vehiculo
   */
  private makePopup(data: any): void {
    this.markers[data.id].on('click', (e: any) => {
      if (this.compRef) { this.compRef.destroy(); }

      const compFactory =
        this.resolver.resolveComponentFactory(PopupMapComponent);
      this.compRef = compFactory.create(this.injector);
      this.compRef.instance.data = data;

      const div = document.createElement('div');
      div.appendChild(this.compRef.location.nativeElement);

      this.popup.setLatLng(e.latlng);
      this.popup.setContent(div);
      this.popup.openOn(this.map);
      this.appRef.attachView(this.compRef.hostView);

      this.compRef.onDestroy(() => {
        this.popup.closePopup();
        this.appRef.detachView(this.compRef.hostView);
      });
    });
  }

  /**
   * @description: Asigna la rotacion de los iconos
   * @param data - la informacion del vehiculo
   */
  private rotationIcon(data: any): number | null {
    return data.speed > 0 ? data.orientation : null;
  }

  /**
   * @description: Utilizamos funcion del navegador para consultar la latitud y longitud
   */
  private getPosition(): Promise<{ lng: number; lat: number }> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({
            lng: resp.coords.longitude,
            lat: resp.coords.latitude,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }
}


// createHistoric(type, historic, color) {
//   console.log(historic, 'joseeeee');

//   if (type === 'punt') {
//     let myIconUrl =
//       'data:image/svg+xml,' +
//       encodeURIComponent(
//         '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_94_339)"><path d="M15 24C15 24 24 19 24 12C24 7.02944 19.9706 3 15 3C10.0294 3 6 7.02944 6 12C6 19 15 24 15 24Z" fill="' +
//         color +
//         '"/><path d="M15 24C15 24 24 19 24 12C24 7.02944 19.9706 3 15 3C10.0294 3 6 7.02944 6 12C6 19 15 24 15 24Z" stroke="white" stroke-width="0.5"/></g><circle cx="15" cy="12" r="7" fill="white"/><path d="M18.25 12.0311L13 15.0622L13 9L18.25 12.0311Z" fill="#006AA3"/><defs><filter id="filter0_d_94_339" x="-0.25" y="-3.25" width="30.5" height="33.536" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_94_339"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_94_339" result="shape"/></filter></defs></svg>'
//       );
//     let myIconUrl2 =
//       'data:image/svg+xml,' +
//       encodeURIComponent(
//         '<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_94_338)"><path d="M15 24C15 24 24 19 24 12C24 7.02944 19.9706 3 15 3C10.0294 3 6 7.02944 6 12C6 19 15 24 15 24Z" fill="' +
//         color +
//         '"/><path d="M15 24C15 24 24 19 24 12C24 7.02944 19.9706 3 15 3C10.0294 3 6 7.02944 6 12C6 19 15 24 15 24Z" stroke="white" stroke-width="0.5"/></g><circle cx="15" cy="12" r="7" fill="white"/><rect x="11.4286" y="12.2857" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="12.8572" y="10.8571" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="14.2857" y="9.42859" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="14.2857" y="12.2857" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="15.7143" y="10.8571" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="10" y="10.8571" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="11.4286" y="9.42859" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="12.8572" y="8" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="15.7143" y="8" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="17.1428" y="9.42859" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="18.5714" y="10.8571" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="17.1428" y="12.2857" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="15.7143" y="13.7143" width="1.42857" height="1.42857" fill="#006AA3"/><rect x="12.8572" y="13.7143" width="1.42857" height="1.42857" fill="#006AA3"/><defs><filter id="filter0_d_94_338" x="-0.25" y="-3.25" width="30.5" height="33.536" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_94_338"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_94_338" result="shape"/></filter></defs></svg>'
//       );
//     // this.map.setView([historic.x_inicial, historic.y_inicial], 10);
//     this.markersPoint[-1] = L.marker(
//       [historic.x_inicial, historic.y_inicial],
//       {
//         icon: L.icon({
//           iconUrl: myIconUrl,
//           iconSize: [60, 60],
//           iconAnchor: [30, 30],
//         }),
//       }
//     );

//     this.markersPoint[-2] = L.marker(
//       [historic.x_final, historic.y_final],
//       {
//         icon: L.icon({
//           iconUrl: myIconUrl2,
//           iconSize: [60, 60],
//           iconAnchor: [30, 30],
//         }),
//       }
//     );

//     this.markersPoint[-1].addTo(this.map);
//     this.markersPoint[-2].addTo(this.map);
//   } else {
//     this.paint_punts = [];
//     this.clusterHistoric = L.markerClusterGroup({
//       iconCreateFunction: function (cluster) {
//         var marker = cluster.getAllChildMarkers();
//         var html =
//           '<div class="svg-icon abstract-tracker-marker" title="" style="transform: rotate(' +
//           marker[marker.length - 1].options.rotationAngle +
//           'deg) scale(1); transform-origin: center center;">          <img src="' +
//           marker[marker.length - 1].options.icon.options.iconUrl +
//           '" width="24px" height="24px"></div>';
//         return L.divIcon({
//           html: html,
//           className: '',
//           iconSize: L.point(24, 24),
//           iconAnchor: L.point(12, 12),
//         });
//       },
//     });
//     // let waypoints = [];
//     for (let i = 0; i < historic.length; i++) {
//       const element = historic[i];
//       let x = element.x;
//       let y = element.y;
//       this.paint_punts.push({
//         lat: x,
//         lng: y,
//       });
//       // waypoints.push(new L.LatLng(x, y));
//       this.markersPoint[historic[i].id] = L.marker([x, y], {
//         icon: this.setIcon(historic[i], 'historic', color),
//       });
//       this.markersPoint[historic[i].id].addTo(this.clusterHistoric);
//       this.clusterHistoric.addTo(this.map);

//       this.markersPoint[historic[i].id].on('click', (e: any) => {
//         moment.locale('es');
//         this.getPopup(e, historic[i]);
//       });

//       this.markersPoint[historic[i].id].options.rotationAngle =
//         this.rotationIconHistoric(historic[i]);
//     }

//     this.map.setView(
//       [this.paint_punts[0].lat, this.paint_punts[0].lng],
//       12
//     );
//     // L.Routing.control({
//     //     waypoints: waypoints,
//     //     plan: L.Routing.plan(waypoints, {
//     //         createMarker: function (i, wp, n) {
//     //             if (i == 0 || i == n - 1) {
//     //                 return L.marker(wp.latLng, {
//     //                     draggable: false // prevent users from changing waypoint position
//     //                 });
//     //             } else {
//     //                 return false;
//     //             }
//     //         }
//     //     }),
//     //     routeWhileDragging: false,
//     //     fitSelectedRoutes: false,
//     //     addWaypoints: false
//     // }).addTo(this.map);

//     this.punt_geometry[historic[0].id] = new L.Polyline(
//       this.paint_punts,
//       {
//         color: color,
//         weight: 6,
//       }
//     );

//     this.punt_geometry[historic[0].id].addTo(this.map);
//   }
// }

// async getHistoric(data: any) {
//   console.log(data, 'daataaa');

//   return new Promise((resolve, reject) => {
//     this._historicService.getHistories(data).subscribe(
//       (res: any) => {
//         if (
//           this.mapFunctionalitieService.type_historic ===
//           'historic'
//         ) {
//           resolve(res);
//           this.mapFunctionalitieService.historic = [];
//           let historic = res;

//           for (
//             let i = 0;
//             i <
//             this.mapFunctionalitieService.plateHistoric.length;
//             i++
//           ) {
//             const element =
//               this.mapFunctionalitieService.plateHistoric[i];

//             let encontrado = historic.plates.filter((x) => {
//               return x.plate == element;
//             });

//             let data = [];
//             if (encontrado.length > 0) {
//               data = historic.data.filter((x) => {
//                 return x.plate == element;
//               });

//               this.mapFunctionalitieService.historic.push({
//                 plate: element,
//                 color: getRandomColor(),
//                 data: data,
//                 selected: false,
//               });
//             } else {
//               this.mapFunctionalitieService.historic.push({
//                 plate: element,
//                 data: data,
//               });
//             }
//           }

//           for (
//             let j = 0;
//             j < this.mapFunctionalitieService.historic.length;
//             j++
//           ) {
//             this.mapFunctionalitieService.historic[j].data.map(
//               (x) => {
//                 return (x['selected'] = false);
//               }
//             );
//           }
//         } else {
//           resolve(res.data);
//         }
//       },
//       async (err) => {
//         reject(err);
//       }
//     );
//   });
// }

//   async getHistoricTrip(data: any) {
//   return new Promise((resolve, reject) => {
//     this._historicService.getHistoriesTrip(data).subscribe(
//       (res: any) => {
//         resolve(res);
//         this.mapFunctionalitieService.historicTrip = [];
//         let historicTrip = res;

//         for (
//           let i = 0;
//           i < this.mapFunctionalitieService.plateHistoric.length;
//           i++
//         ) {
//           const element =
//             this.mapFunctionalitieService.plateHistoric[i];

//           let encontrado = historicTrip.plates.filter((x) => {
//             return x.plate == element;
//           });

//           let data = [];
//           let trip = [];
//           if (encontrado.length > 0) {
//             data = historicTrip.data.filter((x) => {
//               return x.plate == element;
//             });

//             trip = historicTrip.trips.filter((x) => {
//               return x.plate == element;
//             });

//             let trips = [];
//             for (let j = 0; j < trip.length; j++) {
//               const element = trip[j];
//               trips.push({
//                 ...element,
//                 item: j + 1,
//                 color: getRandomColor(),
//               });
//             }

//             this.mapFunctionalitieService.historicTrip.push({
//               plate: element,
//               color: getRandomColor(),
//               ...data[0],
//               trips: trips,
//               selected: false,
//               tiene_data: true,
//             });
//           } else {
//             this.mapFunctionalitieService.historicTrip.push({
//               plate: element,
//               tiene_data: false,
//             });
//           }
//         }
//       },
//       async (err) => {
//         reject(err);
//       }
//     );
//   });
// }
