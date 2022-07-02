import { Injectable } from '@angular/core';
import moment from 'moment';
import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  mobiles: any[] = [];
  public markers: any = {};
  public map: L.Map;

  constructor(
  ) { }

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

  setMarkers(mobiles) {
    console.log(mobiles);
    const markerCluster = new MarkerClusterGroup;
    const infoWindows = `<table>
        <tr>
            <th rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">
            </th>
            <th>GB001</th>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">

            </td>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">

            </td>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">

            </td>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">
            </td>
        </tr>
        <tr>
            <td>4444</td>
        </tr>
        <tr>
            <th colspan="3"> ultimo reporte</th>
            <th colspan="3">Velocidad</td>
        </tr>
        <tr>
            <td colspan="3"> hace 40 min</td>
            <td colspan="3">45 Km/H</td>
        </tr>
        <tr>
            <th colspan="6">Ultima posicion</th>
        </tr>
        <tr>
            <td colspan="6">Cra 55 # 100 - 51 Barranquilla, Atlantico</td>
        </tr>
        <tr>
            <th colspan="6">Frencuencia actual</th>
        </tr>
           </table>`;
    const popup = L.popup();
    mobiles.forEach((value: any, index: string | number) => {
      const data = mobiles[index];
      this.markers[data.id] = new L.Marker([data.x, data.y], {
        icon: this.setIcon(data),
        rotationAngle: this.rotationIcon(data),
      })
        .bindTooltip(data.plate, {
          permanent: true,
          direction: 'bottom',
          offset: L.point({ x: 2, y: 10 }),
        })
        .addTo(markerCluster);
      this.markers[data.id]
        .bindPopup(infoWindows, {
          closeOnClick: false,
          autoClose: false,
          closeButton: true,
        })
        .openPopup();
      markerCluster.addTo(this.map);
    });
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
      if (data.engine === 0) {
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
