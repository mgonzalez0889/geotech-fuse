import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoriesService {
  public behaviorSubjectDataForms: BehaviorSubject<{ payload?: any }> =
    new BehaviorSubject({ payload: '' });

  public behaviorSubjectDataFormsTrip: BehaviorSubject<{ payload?: any }> =
    new BehaviorSubject({ payload: '' });

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene el listado de historico
   */
  public getHistories(data: any): Observable<any> {
    const params = { method: 'create_historic' };
    return this._http.post(this._appSettings.histories.url.base, data, {
      params,
    });
  }

  /**
   * @description: Obtiene el listado de historico trip
   */
  public getHistoriesTrip(data: any): Observable<any> {
    const params = { method: 'create_historic_trip' };
    return this._http.post(this._appSettings.histories.url.base, data, {
      params,
    });
  }

  /**
   * @description: Obtiene el historico por vehiculo con paginacion
   */
  public getHistoricPlate(data: any): Observable<any> {
    const params = { method: 'create_report_historic' };
    return this._http.post(this._appSettings.histories.url.base, data, {
      params,
    });
  }

  /**
   * @description: Obtiene el historico por flota con paginacion
   */
  public getGistoricFleet(data: any): Observable<any> {
    const params = { method: 'create_report_historic_fleet' };
    return this._http.post(this._appSettings.histories.url.base, data, {
      params,
    });
  }

  /**
   * @description: Genera el reporte por vehiculo en .CSV
   */
  public getHistoricExportMovile(data: any): Observable<any> {
    const params = { method: 'create_report_historic_export' };
    return this._http.post(this._appSettings.histories.url.base, data, {
      params,
    });
  }

  /**
   * @description: Genera el reporte por flota en .CSV
   */
  public getHistoricExportFleet(data: any): Observable<any> {
    const params = { method: 'create_report_historic_fleet_export' };
    return this._http.post(this._appSettings.histories.url.base, data, {
      params,
    });
  }
}
