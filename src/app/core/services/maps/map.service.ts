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
  mobiles: any[] = [];
  public dataSource: any = [];
  public markers: any = {};
  public map: L.Map;
  public markerCluster = new MarkerClusterGroup;

  // Mostrar y ocultar componentes de mapa (Menu mobiles, geotools, historico, comandos)
  public showMenuMobiles: boolean = true;
  public showDetailMobile: boolean = false;
  public showGeoTools: boolean = false;
  public showOptionsGeoTools: boolean = false;

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

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) { }

  drawerOpenedChanged(opened: boolean): void {
    this.drawerOpened = !this.drawerOpened;
  }

  visibleGeo() {
    this.drawerOpenedChanged(!this.drawerOpened);
    this.showMenuMobiles = !this.showMenuMobiles;
    this.showOptionsGeoTools = !this.showOptionsGeoTools;
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
      L.control.layers(baseLayers).addTo(this.map);
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
  }

  getPopup(e, data: any) {
    if (this.compRef) this.compRef.destroy();

    // creation component, AppInfoWindowComponent should be declared in entryComponents
    const compFactory = this.resolver.resolveComponentFactory(InfoWindowsComponent);
    this.compRef = compFactory.create(this.injector);

    // example of parent-child communication
    console.log(data);
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
      case 'X':
        iconInfoWindows['statusGps'] =
          'status_gps_gray';
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
      case 'X':
        iconInfoWindows['statusSignal'] =
          'signal_level_gray';
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
