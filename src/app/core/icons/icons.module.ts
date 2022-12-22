/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IConfigIcon } from '../interfaces/other/icon.interface';
import L from 'leaflet';
import moment from 'moment';

@NgModule()
export class IconsModule {

  public iconHistory: L.Icon<L.IconOptions> = L.icon({
    iconUrl:
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg width="16" height="31" viewBox="0 0 16 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.34146 0.880403C8.28621 0.656155 8.08457 0.498922 7.85362 0.500006C7.62268 0.501089 7.42252 0.660209 7.36938 0.884965L0.513413 29.885C0.457854 30.12 0.578199 30.3611 0.7994 30.458C1.0206 30.5549 1.27944 30.4798 1.41449 30.2796L7.86444 20.7191L14.591 30.2875C14.7293 30.4844 14.9882 30.5547 15.2071 30.4551C15.4261 30.3554 15.543 30.114 15.4855 29.8804L8.34146 0.880403Z" fill="' +
        'red' +
        '" stroke="white" stroke-linejoin="round"/></svg>'
      ),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
  private _countries: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(
    private _domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry,
    private _http: HttpClient
  ) {
    this._matIconRegistry.addSvgIconSet(this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('mat_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('mat_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-solid.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('iconsmind', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/iconsmind.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('feather', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
    this._matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
    this._matIconRegistry.addSvgIcon('status_close', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_close.svg'));
    this._matIconRegistry.addSvgIcon('status_gps_green', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_gps_green.svg'));
    this._matIconRegistry.addSvgIcon('status_gps_orange', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_gps_orange.svg'));
    this._matIconRegistry.addSvgIcon('status_gps_red', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_gps_red.svg'));
    this._matIconRegistry.addSvgIcon('status_gps_gray', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_gps_gray.svg'));
    this._matIconRegistry.addSvgIcon('status_open_color', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_open_color.svg'));
    this._matIconRegistry.addSvgIcon('status_close_color', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/status_close_color.svg'));
    this._matIconRegistry.addSvgIcon('circle-off', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/circle-off.svg'));
    this._matIconRegistry.addSvgIcon('circle-on', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/circle-on.svg'));
    this._matIconRegistry.addSvgIcon('not-signal-movil', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal_level_green.svg'));
    this._matIconRegistry.addSvgIcon('signal_level_green', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal_level_green.svg'));
    this._matIconRegistry.addSvgIcon('signal_level_orange', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal_level_orange.svg'));
    this._matIconRegistry.addSvgIcon('signal_level_red', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal_level_red.svg'));
    this._matIconRegistry.addSvgIcon('signal_level_gray', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal_level_gray.svg'));
    this._matIconRegistry.addSvgIcon('driver', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/driver.svg'));
    this._matIconRegistry.addSvgIcon('sheet', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/sheet.svg'));
    this._matIconRegistry.addSvgIcon('batery', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/batery_level.svg'));
    this._matIconRegistry.addSvgIcon('settings-map', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/settings.svg'));
    this._matIconRegistry.addSvgIcon('type-map', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/type-map.svg'));
    this._matIconRegistry.addSvgIcon('route-map', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/route.svg'));
    this._matIconRegistry.addSvgIcon('zone-map', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/zone.svg'));
    this._matIconRegistry.addSvgIcon('point-map', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/point.svg'));
    this._matIconRegistry.addSvgIcon('battery_green', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/battery-green.svg'));
    this._matIconRegistry.addSvgIcon('battery_yellow', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/battery-yellow.svg'));
    this._matIconRegistry.addSvgIcon('battery_orange', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/battery-orange.svg'));
    this._matIconRegistry.addSvgIcon('battery_red', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/battery-red.svg'));
    this._matIconRegistry.addSvgIcon('geo-cancel', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-cancel.svg'));
    this._matIconRegistry.addSvgIcon('geo-back', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-back.svg'));
    this._matIconRegistry.addSvgIcon('geo-clear', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-clear.svg'));
    this._matIconRegistry.addSvgIcon('geo-save', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-save.svg'));
    this._matIconRegistry.addSvgIcon('signal-movil', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal-movil.svg'));
    this._matIconRegistry.addSvgIcon('not-signal-movil', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/not-signal-movil.svg'));
    this._matIconRegistry.addSvgIcon('fixed-movil', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/fixed-movil.svg'));
    this._matIconRegistry.addSvgIcon('historic', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/historic.svg'));
    this._matIconRegistry.addSvgIcon('engine_shutdown', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/engine_shutdown_icon.svg'));
    this._matIconRegistry.addSvgIcon('engine_ignition', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/engine_ignition_icon.svg'));
    this._matIconRegistry.addSvgIcon('plus-border', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/plus-border.svg'));
    this._matIconRegistry.addSvgIcon('close-geo', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/close.svg'));
    this._matIconRegistry.addSvgIcon('no_report', this._domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/not-signal-movil.svg'));
  }

  public iconStatus(data: any): IConfigIcon {
    const configIcon = {
      icon: '',
      text: ''
    };
    const typeService = data.class_mobile_name.toLowerCase();
    if (typeService === 'geobolt') {
      switch (Number(data.status)) {
        case 0:
          configIcon['icon'] = 'status_open_color';
          configIcon['text'] = 'map.icons.iconTextOpen';
          break;
        case 1:
          configIcon['icon'] = 'status_close_color';
          configIcon['text'] = 'map.icons.iconTextClose';
          break;
      }
    } else if (typeService === 'vehicular' || typeService === 'telemetria') {
      switch (Number(data.status)) {
        case 0:
          configIcon['icon'] = 'engine_shutdown';
          configIcon['text'] = 'map.icons.iconTextOff';
          break;
        case 1:
          configIcon['icon'] = 'engine_ignition';
          configIcon['text'] = 'map.icons.iconTextOn';
          break;
      }
    }
    const diffDays = moment(new Date()).diff(
      moment(data.date_entry),
      'days'
    );

    if (diffDays >= 1 || isNaN(diffDays)) {
      configIcon['icon'] = 'no_report';
      configIcon['text'] = 'map.icons.iconTextReport';
    }
    return configIcon;
  }

  public iconStatusGps(data: any): IConfigIcon {
    const configIcon = {
      icon: null,
      text: ''
    };
    const statusGps = data.status_gps.toLowerCase();
    switch (statusGps) {
      case 'excelente':
        configIcon['icon'] = 'status_gps_green';
        configIcon['text'] = `${data.status_gps}`;
        break;
      case 'regular':
        configIcon['icon'] = 'status_gps_orange';
        configIcon['text'] = `${data.status_gps}`;
        break;
      case 'mala':
        configIcon['icon'] = 'status_gps_red';
        configIcon['text'] = `${data.status_gps}`;
        break;
    }
    return configIcon;
  }

  public iconStatusSignal(data: any): IConfigIcon {
    const configIcon = {
      icon: null,
      text: ''
    };
    const statusSignal = data.status_signal.toLowerCase();
    switch (statusSignal) {
      case 'excelente':
        configIcon['icon'] = 'signal_level_green';
        break;
      case 'regular':
        configIcon['icon'] = 'signal_level_orange';
        break;
      case 'mala':
        configIcon['icon'] = 'signal_level_red';
        break;
      case 'sin señal':
        configIcon['icon'] = 'not-signal-movil';

    }
    configIcon['text'] = `${data.type_net}`;
    return configIcon;
  }

  public iconStatusBattery(data: any): IConfigIcon {
    const battery = Number(data.battery);
    const configIcon = {
      icon: null,
      text: ''
    };
    if (battery >= 0 && battery <= 25) {
      configIcon['icon'] = 'battery_red';
    } else if (battery >= 26 && battery <= 50) {
      configIcon['icon'] = 'battery_orange';
    } else if (battery >= 51 && battery <= 75) {
      configIcon['icon'] = 'battery_yellow';
    } else if (battery >= 76 && battery <= 100) {
      configIcon['icon'] = 'battery_green';
    }
    configIcon['text'] = `${battery}%`;
    return configIcon;
  }

  /**
   * Getter for countries
   */
  get countries$(): Observable<any> {
    return this._countries.asObservable();
  }

  getCountries(): Observable<any> {
    return this._http.get<any>('api/apps/contacts/countries');
  }
}
