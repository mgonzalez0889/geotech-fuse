import { Injectable, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import moment from 'moment';
import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import { timer } from 'rxjs';
import 'leaflet.marker.slideto';
import { InfoWindowsComponent } from 'app/pages/tracking/osm-maps/info-windows/info-windows.component';

@Injectable({
  providedIn: 'root',
})
export class MapFunctionalitieService {
  public pointLatLens: any = [];
  public mobiles: any[] = [];
  public geometrys: any[] = [];
  public dataSource: any = [];
  public markers: any = {};
  public map: L.Map;
//   public markerCluster = new MarkerClusterGroup();
  public markerCluster = L.markerClusterGroup();

  // Mostrar y ocultar componentes de mapa (Menu mobiles, geotools, historico, comandos)
  public showMenuMobiles: boolean = true;
  public showDetailMobile: boolean = false;
  public showGeoTools: boolean = false;
  public showOptionsGeoTools: boolean = false;
  public showFormGeomertry: boolean = false;

  drawerMode = 'side';
  drawerOpened = false;

  popup = L.popup({
    closeButton: false,
    keepInView: true,
    maxWidth: 300,
  });
  compRef: any;
  placeInfoWindow: any;
  counter: any;
  dataInfoWindows: any;
  type_geometry: string;
  type_geo: string = '';
  punts_geometry: any = [];
  paint_punts: any = [];
  coordinates = [];
  markersPoint = {};
  shape: any = [];
  new_point: string;
  punt_geometry: any = [];;
  count: number = 0;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) { }

  drawerOpenedChanged(): void {
    this.drawerOpened = !this.drawerOpened;
  }

  visibleGeo() {
    this.drawerOpenedChanged();
    this.showMenuMobiles = !this.showMenuMobiles;
    this.showOptionsGeoTools = !this.showOptionsGeoTools;

    if (!this.showOptionsGeoTools) {
      this.setMarkers(this.mobiles);
    } else {
      this.deleteChecks(this.mobiles);
    }
  }

  init() {
    const time = timer(1000);
    time.subscribe((t) => {
      const googleMaps = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      );

      const googleHybrid = L.tileLayer(
        'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      );

      this.map = L.map('map', {
        center: [4.658383846282959, -74.09394073486328],
        zoom: 10,
        layers: [googleMaps],
        attributionControl: false,
      });

      const baseLayers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Google Maps': googleMaps,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Google Hibrido': googleHybrid,
      };
      // L.control.layers(baseLayers).addTo(this.map);

      // L.control.zoom({
      //   position: 'topright'
      // }).addTo(this.map);
    });
  }

  loadAllsMobiles() {
    this.deleteChecks(this.mobiles);
    this.setMarkers(this.mobiles);
  }

  receiveData(type: string, data: any) {
    console.log(data)
    if (type === 'checked') {
      if (data.length) {
        this.deleteChecks(data);
        this.setMarkers(data);
      } else {
        this.loadAllsMobiles();
      }
    } else {
      this.loadAllsMobiles();
    }
  }

  deleteChecks(data: any) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      this.map.removeLayer(this.markers[element.id]);
      this.markerCluster.clearLayers();
    }
  }

  moveMarker(data) {
    // const marker = new DriftMarker([10, 10]);
    if (this.markers.hasOwnProperty(data.id_mobile)) {
      this.markers[data.id_mobile].slideTo([data.x, data.y], {
        duration: 2000,
        icon: this.setIcon(data)
      });
      this.markers[data.id_mobile].options.rotationAngle =
        this.rotationIcon(data);
      this.markers[data.id_mobile].setIcon(this.setIcon(data));
      this.setData(data);
    }
  }

  setData(data: any) {
    this.mobiles.forEach((x) => {
      if (x.id == data.id_mobile) {
        x.orientation = data.orientation;
        x.speed = data.speed;
        x.x = data.x;
        x.y = data.y;
        x.status = Number(data.status);
        x.status_gps = data.status_gps;
        x.status_signal = data.status_signal;
      }
    });
  }

  setMarkers(mobiles: any[]): any {

    mobiles.forEach((value: any, index: number) => {
      const data = mobiles[index];
      this.markers[data.id] = new L.Marker([data.x, data.y], {
        icon: this.setIcon(data)
      })
        .bindTooltip(data.plate, {
          permanent: true,
          direction: 'bottom',
          offset: L.point({ x: 0, y: 18 }),
        })
        .addTo(this.markerCluster);
      this.markerCluster.addTo(this.map);
      this.pointLatLens.push(
        Object.values(this.markers[data.id].getLatLng())
      );
      this.markers[data.id].options.rotationAngle =
        this.rotationIcon(data);
      this.markers[data.id].on('click', (e: any) => {
        moment.locale('es');
        this.getPopup(e, data);
      });
    });
    this.map.fitBounds(this.pointLatLens);
    this.map.on('click', (e) => {
      if (!this.showMenuMobiles) {
        switch (this.type_geo) {
          case 'route':
            this.createGeometry(e);
            break;
          case 'zone':
            this.createGeometry(e);
            break;
          case 'punt':
            let id = 9999999999;
            this.showFormGeomertry = true;
            this.showOptionsGeoTools = false;
            this.showGeoTools = false;
            var latlng = this.map.mouseEventToLatLng(e.originalEvent);
            // if (this.markersPoint[id] != undefined) {
            //   this.map.removeLayer(this.markersPoint[id]);
            // }
            this.goDeleteGeometryPath();
            this.map.setView([latlng.lat, latlng.lng]);
            this.markersPoint[id] = L.marker(
              [latlng.lat, latlng.lng], {
              icon: L.icon({
                iconUrl: '../assets/icons/iconMap/punt.svg',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
              })
            });

            this.shape.push(String(latlng.lat + ' ' + latlng.lng));
            this.markersPoint[id].addTo(this.map);
            break;
        }
      }
    });
  }


  createPunt(data: any, validate?): void {
      let myIconUrl;
      let x;
      let y;
      if(!validate){
        myIconUrl = "data:image/svg+xml," + encodeURIComponent('<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19C5.73693 17.9227 4.56619 16.7416 3.5 15.4691C1.9 13.5581 8.83662e-07 10.712 8.83662e-07 8.00005C-0.00141728 5.1676 1.70425 2.61344 4.32107 1.52945C6.93789 0.445455 9.95007 1.04529 11.952 3.04905C13.2685 4.35966 14.0059 6.14244 14 8.00005C14 10.712 12.1 13.5581 10.5 15.4691C9.43382 16.7416 8.26307 17.9227 7 19ZM7 5.00005C5.92821 5.00005 4.93782 5.57185 4.40193 6.50005C3.86603 7.42825 3.86603 8.57185 4.40193 9.50005C4.93782 10.4283 5.92821 11.0001 7 11.0001C8.65686 11.0001 10 9.6569 10 8.00005C10 6.3432 8.65686 5.00005 7 5.00005Z" fill="'+data.color+'"/></svg>');
        const shape = JSON.parse(data.shape)[0];
        x = shape.split(' ')[0];
        y = shape.split(' ')[1];
        }else{
        myIconUrl = "data:image/svg+xml," + encodeURIComponent('<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19C5.73693 17.9227 4.56619 16.7416 3.5 15.4691C1.9 13.5581 8.83662e-07 10.712 8.83662e-07 8.00005C-0.00141728 5.1676 1.70425 2.61344 4.32107 1.52945C6.93789 0.445455 9.95007 1.04529 11.952 3.04905C13.2685 4.35966 14.0059 6.14244 14 8.00005C14 10.712 12.1 13.5581 10.5 15.4691C9.43382 16.7416 8.26307 17.9227 7 19ZM7 5.00005C5.92821 5.00005 4.93782 5.57185 4.40193 6.50005C3.86603 7.42825 3.86603 8.57185 4.40193 9.50005C4.93782 10.4283 5.92821 11.0001 7 11.0001C8.65686 11.0001 10 9.6569 10 8.00005C10 6.3432 8.65686 5.00005 7 5.00005Z" fill="'+data.color_event+'"/></svg>');
        x = data.x;
        y = data.y;
    }
    this.map.setView([x, y]);
    this.markersPoint[data.id] = L.marker(
      [x, y], {
      icon: L.icon({
        iconUrl: myIconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })
    });

    this.markersPoint[data.id].addTo(this.map);
  }

  createGeometry(e) {
    this.showGeoTools = false;
    this.count++;
    var latlng = this.map.mouseEventToLatLng(e.originalEvent);
    this.paint_punts.push({
      lat: latlng.lat,
      lng: latlng.lng,
    });

    this.punts_geometry.push(latlng.lng);
    this.punts_geometry.push(latlng.lat);
    var latlngs = [this.paint_punts];

    switch (this.type_geo) {
      case 'route':
        this.shape.push(String(latlng.lat + ' ' + latlng.lng));

        this.punt_geometry[this.count] = L.polyline(latlngs, {
          color: "blue",
          weight: 6,
        });
        break;
      case 'zone':
        this.shape.push(String(latlng.lat + ' ' + latlng.lng));

        this.punt_geometry[this.count] = L.polygon(latlngs, {
          color: "blue",
          weight: 6,
        });
        break;
    }

    this.punt_geometry[this.count].addTo(this.map);
  }

  goCancelToGeometry() {
    this.goDeleteGeometryPath();
    this.type_geo = '';
    this.visibleGeo();
    this.showOptionsGeoTools = false;
    this.showFormGeomertry = false;
  }

  goBackToGeometry() {
    var punt;
    for (punt in this.punt_geometry) {
    }
    this.map.removeLayer(this.punt_geometry[punt]);
    delete this.punt_geometry[punt];
    console.log(this.punt_geometry);
    this.paint_punts.pop();
    this.punts_geometry.splice(-2, 2);
  };

  goDeleteGeometryPath() {
    for (const point in this.markersPoint) {
      this.map.removeLayer(this.markersPoint[point]);
    }

    for (const punt in this.punt_geometry) {
      this.map.removeLayer(this.punt_geometry[punt]);
    }

    this.punt_geometry = [];
    this.paint_punts = [];
    this.punts_geometry = [];
  };

  goAddGeometry() {
    this.showFormGeomertry = true;
    this.showOptionsGeoTools = false;
  }

  getPopup(e, data: any) {
    if (this.compRef) this.compRef.destroy();

    // creation component, AppInfoWindowComponent should be declared in entryComponents
    const compFactory = this.resolver.resolveComponentFactory(InfoWindowsComponent);
    this.compRef = compFactory.create(this.injector);

    // example of parent-child communication
    this.dataInfoWindows = data;
    this.compRef.instance.data = data;
    const subscription = this.compRef.instance.onRefreshData.subscribe(x => { data });

    let div = document.createElement('div');
    div.appendChild(this.compRef.location.nativeElement);

    this.popup.setLatLng(e.latlng)
    this.popup.setContent(div);
    this.popup.openOn(this.map);

    this.appRef.attachView(this.compRef.hostView);
    this.compRef.onDestroy(() => {
      this.appRef.detachView(this.compRef.hostView);
      subscription.unsubscribe();
    });
  }

  public setIconInfoWindows(data: any): any {
    const iconInfoWindows = [];
    let status = Number(data.status);
    switch (data.status_gps) {
      case 'Excelente':
        iconInfoWindows['statusGps'] =
          'status_gps_green';
        break;
      case 'Regular':
        iconInfoWindows['statusGps'] =
          'status_gps_orange';
        break;
      case 'Mala':
        iconInfoWindows['statusGps'] =
          'status_gps_red';
        break;
    }
    switch (status) {
      case 0:
        iconInfoWindows['status'] =
          'status_open_color';
        break;
      case 1:
        iconInfoWindows['status'] =
          'status_close_color';
        break;
    }
    switch (data.status_signal) {
      case 'Excelente':
        iconInfoWindows['statusSignal'] =
          'signal_level_green';
        break;
      case 'Regular':
        iconInfoWindows['statusSignal'] =
          'signal_level_orange';
        break;
      case 'Mala':
        iconInfoWindows['statusSignal'] =
          'signal_level_red';
        break;
    }

    return iconInfoWindows;
  }

  /**
       * @description: Asigna los iconos para el marcador deacuerdo al estado
       */
  private setIcon(data: any): any {
    const diffDays = moment(new Date()).diff(
      moment(data.date_entry),
      'days'
    );
    let myIcon: L.Icon<L.IconOptions>;
    if (diffDays >= 1 || isNaN(diffDays)) {
      return (myIcon = L.icon({
        iconUrl: '../assets/icons/iconMap/no_report.svg',
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5],
      }));
    } else {
      if (data.status === 0) {
        return (myIcon = L.icon({
          iconUrl: '../assets/icons/iconMap/engine_shutdown.svg',
          iconSize: [25, 25],
          iconAnchor: [12.5, 12.5],
        }));
      } else {
        if (data.speed === 0) {
          return (myIcon = L.icon({
            iconUrl: '../assets/icons/iconMap/engine_ignition.svg',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5],
          }));
        } else {
          return (myIcon = L.icon({
            iconUrl: '../assets/icons/iconMap/arrow.svg',
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          }));
        }
      }
    }
  }

  /**
  * @description: Asigna la rotacion de los iconos
  */
  private rotationIcon(data: any): any {
    const diffDays = moment(new Date()).diff(
      moment(data.date_entry),
      'days'
    );
    let rotaIcon: any;
    if (diffDays >= 1 || isNaN(diffDays)) {
      return (rotaIcon = null);
    } else {
      return (rotaIcon = data.orientation);
    }
  }
}
