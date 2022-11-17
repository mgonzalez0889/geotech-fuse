import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private _countries: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private _http: HttpClient
  ) { }

  loadIcons(): void {
    this.iconRegistry.addSvgIcon(
      'status_gps_green',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/status_gps_green.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'status_gps_orange',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/status_gps_orange.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'status_gps_red',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/status_gps_red.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'status_gps_gray',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/status_gps_gray.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'status_open_color',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/status_open_color.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'status_close_color',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/status_close_color.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'circle-off',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/circle-off.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'circle-on',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/circle-on.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'signal_level_green',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/signal_level_green.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'signal_level_orange',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/signal_level_orange.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'signal_level_red',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/signal_level_red.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'signal_level_gray',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/signal_level_gray.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'driver',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/driver.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'sheet',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/sheet.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'batery',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/batery_level.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'settings-map',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/settings.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'type-map',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/type-map.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'route-map',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/route.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'zone-map',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/zone.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'point-map',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/point.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'battery_green',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/battery-green.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'battery_yellow',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/battery-yellow.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'battery_orange',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/battery-orange.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'battery_red',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/battery-red.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'geo-cancel',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/geo-cancel.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'geo-back',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/geo-back.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'geo-clear',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/geo-clear.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'geo-save',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        './assets/icons/iconMap/geo-save.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'signal-movil',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/signal-movil.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'not-signal-movil',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/not-signal-movil.svg'
      )
    );
    this.iconRegistry.addSvgIcon(
      'fixed-movil',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/fixed-movil.svg')
    );
    this.iconRegistry.addSvgIcon(
      'historic',
      this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/historic.svg'
      )
    );
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
