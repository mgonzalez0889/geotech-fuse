import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene todos las zonas
   */
  public getZones() {
    const params = { method: 'index_all_zones', type: 'zones' };
    return this._http.get(this._appSettings.owner_zone.url.base, { params });
  }
}
