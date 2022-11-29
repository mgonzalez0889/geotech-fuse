/* eslint-disable @typescript-eslint/naming-convention */
import * as L from 'leaflet';
import moment from 'moment';
import 'leaflet.markercluster';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PopupMapComponent } from '../../../pages/tracking/maps/popup-map/popup-map.component';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { IOptionPanelGeotools, IOptionPanelMap } from 'app/core/interfaces/services/map.interface';

@Injectable({
  providedIn: 'root',
})
export class MapToolsService {
  public map: L.Map;
  public markerCluster = L.markerClusterGroup();
  public markers: any = {};
  public verLabel: boolean = true;
  public verCluster: boolean = true;
  public pointLatLens: any = [];
  public clusterHistoric: L.MarkerClusterGroup;
  public markersPoint: any = {};
  public compRef: ComponentRef<PopupMapComponent>;
  public mobileSocket: Subject<any> = new Subject();
  public selectPanel: BehaviorSubject<IOptionPanelMap> = new BehaviorSubject({ panel: 'none', data: null });
  public selectPanelGeoTools: Subject<IOptionPanelGeotools> = new Subject();
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

  get mobileSocketData$(): Observable<any> {
    return this.mobileSocket.asObservable();
  }

  get selectPanelMap$(): Observable<IOptionPanelMap> {
    return this.selectPanel.asObservable();
  }

  get selectPanelGeotool$(): Observable<IOptionPanelGeotools> {
    return this.selectPanelGeoTools.asObservable();
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
    const baseLayers = {
      'Google Maps': GoogleMaps,
      'Google Hibrido': GoogleHybrid,
    };
    this.map = L.map('map', { ...optionsMap, layers: [GoogleMaps] });
    L.control.layers(baseLayers).addTo(this.map);
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
      });

      if (this.verLabel) {
        this.markers[data.id].bindTooltip(data.plate, {
          permanent: true,
          direction: 'bottom',
          offset: L.point({ x: 0, y: 18 }),
        });
      } else {
        this.markers[data.id].bindTooltip(data.plate, {
          permanent: false,
          direction: 'bottom',
          offset: L.point({ x: 0, y: 18 }),
        });
      }

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

    this.map.fitBounds(this.pointLatLens);
  }

  /**
   * @description: Asigna los iconos para el marcador deacuerdo al estado
   */
  public setIcon(data: any, type?: any, color?: any): any {
    const diffDays = moment(new Date()).diff(
      moment(data.date_entry),
      'days'
    );
    let myIcon: L.Icon<L.IconOptions>;
    if (type === 'historic') {
      return (myIcon = L.icon({
        iconUrl:
          'data:image/svg+xml,' +
          encodeURIComponent(
            '<svg width="16" height="31" viewBox="0 0 16 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.34146 0.880403C8.28621 0.656155 8.08457 0.498922 7.85362 0.500006C7.62268 0.501089 7.42252 0.660209 7.36938 0.884965L0.513413 29.885C0.457854 30.12 0.578199 30.3611 0.7994 30.458C1.0206 30.5549 1.27944 30.4798 1.41449 30.2796L7.86444 20.7191L14.591 30.2875C14.7293 30.4844 14.9882 30.5547 15.2071 30.4551C15.4261 30.3554 15.543 30.114 15.4855 29.8804L8.34146 0.880403Z" fill="' +
            color +
            '" stroke="white" stroke-linejoin="round"/></svg>'
          ),
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }));
    } else {
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
              iconUrl:
                '../assets/icons/iconMap/engine_ignition.svg',
              iconSize: [25, 25],
              iconAnchor: [12.5, 12.5],
            }));
          } else {
            return (myIcon = L.icon({
              iconUrl: '../assets/icons/iconMap/arrow.svg',
              iconSize: [36, 36],
              iconAnchor: [10, 10],
            }));
          }
        }
      }
    }
  }
  /**
   * @description: Realiza el cambio de orientacion de los iconos del mapa
   */
  public moveMarker(data: any): void {
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
   * @description: Limpia el mapa
   */
  public clearMap(): void {
    for (const point in this.markers) {
      if (this.markers.hasOwnProperty(point)) {
        this.map.removeLayer(this.markers[point]);
        this.markerCluster.clearLayers();
        this.pointLatLens = [];
      }
    }
  }

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
        this.popup.close();
        this.appRef.detachView(this.compRef.hostView);
      });
    });
  }
  /**
   * @description: Asigna la rotacion de los iconos
   */
  private rotationIcon(data: any): any {
    const diffDays = moment(new Date()).diff(
      moment(data.date_entry),
      'days'
    );
    return diffDays >= 1 || isNaN(diffDays) ? null : data.orientation;
  }

  private getPosition(): Promise<{ lng: number; lat: number }> {
    return new Promise((resolve, reject) => {
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
