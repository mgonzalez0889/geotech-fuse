import { Injectable } from '@angular/core';
import moment from 'moment';
import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import { timer } from 'rxjs';
import { events } from '../../mock-api/apps/calendar/data';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  public pointLatLens: any = [];
  mobiles: any[] = [];
  public markers: any = {};
  public map: L.Map;
  public markerCluster = new MarkerClusterGroup;

  constructor() { }

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
        //center: [4.658383846282959, -74.09394073486328],
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

  loadAllsMobiles() {
    this.deleteChecks(this.mobiles);
    this.setMarkers(this.mobiles);
  }

  receiveData(type: string, data: any) {
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
      console.log(element);
      this.map.removeLayer(this.markers[element.id]);
      this.markerCluster.clearLayers();
    }
  }

  setMarkers(mobiles: any[]): any {
    const markerCluster = new MarkerClusterGroup();
    const popup = L.popup({
      closeButton: false,
      keepInView: true,
      maxWidth: 300,
    });
    mobiles.forEach((value: any, index: number) => {
      const data = mobiles[index];
      this.markers[data.id] = new L.Marker([data.x, data.y], {
        icon: this.setIcon(data),
        rotationAngle: this.rotationIcon(data),
      })
        .bindTooltip(data.plate, {
          permanent: true,
          direction: 'bottom',
          offset: L.point({ x: 0, y: 18 }),
        })
        .addTo(markerCluster);
      markerCluster.addTo(this.map);
      this.pointLatLens.push(
        Object.values(this.markers[data.id].getLatLng())
      );
      this.markers[data.id].on('click', (e: any) => {
        moment.locale('es');
        const iconInfoWindows = this.setIconInfoWindows(data);
        const infoWindows =
          `<table
                 cellpadding="4" >
                <tr>
                <th colspan="2">` +
          data.plate +
          `</th>
                <td rowspan="2">
                    <img style="height: 27px;" src="` +
          iconInfoWindows.status +
          `">
                </td>
                <td rowspan="2">
                <img style="height: 27px;" src="` +
          iconInfoWindows.statusGps +
          `">
                </td>
                <td rowspan="2">
                    <img style="height: 27px;" src="` +
          iconInfoWindows.statusSignal +
          `">
                </td>
                <td rowspan="2">
                    <img style="height: 27px;" src="./assets/icons/iconMap/batery_level.svg">
                </td>
            </tr>
            <tr>
                <td colspan="2">` +
          data.code +
          `</td>
            </tr>
            <tr>
                <th colspan="4">Ultima transmisión</th>
                <th align="right" colspan="2">Velocidad</th>
            </tr>
            <tr>
                <td colspan="4">` +
          moment(data.date_entry).fromNow() +
          `</td>
                <td align="right" colspan="2">` +
          data.speed +
          ` Km/h</td>
            </tr>
            <tr>
                <th colspan="6">Ultima posición</th>
            </tr>
            <tr>
                <td colspan="6">` +
          data.address +
          `</td>
            </tr>
            <tr>
                <td align="center" colspan="3">
                    <div style="display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0px;
                gap: 0.6px;
                width: 113px;
                height: 100px;
                background: #E3E3E3;
                border-radius: 10px;">
                        <div><img src="./assets/icons/iconMap/driver.svg"></div>
                        <b>Conductor</b>
                        <div>Jose Perez</div>
                        <div>3008728712</div>
                    </div>
                </td>
                <td align="center" colspan="3">
                    <div style="display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 0px;
                    gap: 0.6px;
                    width: 113px;
                    height: 100px;
                    background: #E3E3E3;
                    border-radius: 10px;">
                        <div><img src="./assets/icons/iconMap/sheet.svg"></div>
                        <b> Planilla</b>
                        <div>` +
          data.sheet +
          `</div>
                    </div>
                </td>
            </tr>
            <tr>
                <th colspan="6">Frecuencia actual</th>
            </tr>
            <tr>
                <td colspan="6">5 Minutos </td>
            </tr>
            <tr>
                <td align="center" colspan="6"> <button style="width: 273px;
                    height: 42px;
                    background: #2C384F; color: white;
                    border-radius: 5px;">Comandos</button>
                </td>
            </tr>
            <tr>
                <td align="center" colspan="6"> <button style="width: 273px;
                    height: 42px;
                    background: #2C384F; color: white;
                    border-radius: 5px;" >Detalles</button>
                </td>
            </tr>
        </table>
        `;
        popup
          .setLatLng(e.latlng)
          .setContent(infoWindows)
          .openOn(this.map);
      });
    });
    const bounds = new L.LatLngBounds(this.pointLatLens);
    this.map.fitBounds(bounds);
  }

  private setIconInfoWindows(data: any): any {
    const iconInfoWindows = [];
    switch (data.status_gps) {
      case 'Excelente':
        iconInfoWindows['statusGps'] =
          './assets/icons/iconMap/status_gps_green.svg';
        break;
      case 'Regular':
        iconInfoWindows['statusGps'] =
          './assets/icons/iconMap/status_gps_orange.svg';
        break;
      case 'Mala':
        iconInfoWindows['statusGps'] =
          './assets/icons/iconMap/status_gps_red.svg';
        break;
    }
    switch (data.status) {
      case 0:
        iconInfoWindows['status'] =
          './assets/icons/iconMap/status_open_color.svg';
        break;
      case 1:
        iconInfoWindows['status'] =
          './assets/icons/iconMap/status_close_color.svg';
        break;
    }
    switch (data.status_signal) {
      case 'Excelente':
        iconInfoWindows['statusSignal'] =
          './assets/icons/iconMap/signal_level_green.svg';
        break;
      case 'Regular':
        iconInfoWindows['statusSignal'] =
          './assets/icons/iconMap/signal_level_orange.svg';
        break;
      case 'Mala':
        iconInfoWindows['statusSignal'] =
          './assets/icons/iconMap/signal_level_red.svg';
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
