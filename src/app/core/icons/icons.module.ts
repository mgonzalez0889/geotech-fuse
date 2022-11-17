import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule()
export class IconsModule {
  /**
   * Constructor
   */
  constructor(
    private _domSanitizer: DomSanitizer,
    private _matIconRegistry: MatIconRegistry
  ) {
    // Register icon sets
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
  }
}
