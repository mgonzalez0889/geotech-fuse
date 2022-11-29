/* eslint-disable max-len */
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
  public verLabel: boolean = true;
  public verCluster: boolean = true;
  public compRef: ComponentRef<PopupMapComponent>;
  public mobileSocket$: Subject<any> = new Subject();
  public selectPanelMap$: BehaviorSubject<IOptionPanelMap> = new BehaviorSubject({ panel: 'none', data: null });
  public selectPanelGeoTools$: Subject<IOptionPanelGeotools> = new Subject();
  private map: L.Map;
  private markerCluster = L.markerClusterGroup();
  private markers: any = {};
  private markersPoint: any = {};
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
  public setIcon(data: any, type?: any, color?: any): L.Icon<L.IconOptions> {
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
    } else {
      if (data.status === 0) {
        return L.icon({
          iconUrl: '../assets/icons/iconMap/engine_shutdown.svg',
          iconSize: [25, 25],
          iconAnchor: [12.5, 12.5],
        });
      } else {
        if (data.speed === 0) {
          return L.icon({
            iconUrl:
              '../assets/icons/iconMap/engine_ignition.svg',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5],
          });
        } else {
          return L.icon({
            iconUrl: '../assets/icons/iconMap/arrow.svg',
            iconSize: [36, 36],
            iconAnchor: [10, 10],
          });
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

    this.map.setView([x, y], 11);
    this.markersPoint[data.id] = L.marker([x, y], {
      icon: L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })
    });

    this.markersPoint[data.id].addTo(this.map);
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
