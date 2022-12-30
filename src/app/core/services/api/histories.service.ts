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
}
