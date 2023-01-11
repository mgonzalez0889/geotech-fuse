import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from 'app/core/app-configs/app-settings.service';
import { TypeGeotool } from '@interface/index';

@Injectable({
  providedIn: 'root'
})
export class GeotoolMapService {

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene todos las geometrias, dependiendo de parametro type(routes, zones, punts)
   */
  public getGeometry(type: TypeGeotool): Observable<any> {
    const params = { method: 'index_all_zones', type };
    return this._http.get(this._appSettings.owner_zone.url.base, {
      params,
    });
  }

  /**
   * @description: Guarda las geometrias, dependiendo de parametro type(routes, zones, punts)
   */
  public postGeometry(type: string, data: any): Observable<any> {
    const params = { method: 'create_geozones', type };
    return this._http.post(this._appSettings.owner_zone.url.base, data, {
      params,
    });
  }

  public updateGeometry(type: string, data: any, geoId: number): Observable<any> {
    const params = { method: 'update_geozones', type };
    return this._http.put(`${this._appSettings.owner_zone.url.base}/${geoId}`, data, {
      params
    });
  }

  public deleteGeometry(type: string, geometryId: number): Observable<any> {
    const params = { method: 'delete_zones', type };
    return this._http.delete(`${this._appSettings.owner_zone.url.base}/${geometryId}`, {
      params
    });
  }
}
