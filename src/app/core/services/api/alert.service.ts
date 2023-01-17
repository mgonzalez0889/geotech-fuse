import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponseInterface, IAlert } from '@interface/index';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { Store } from '@tools/store.tool';
import { tap } from 'rxjs/operators';

interface AlertState { alerts: IAlert[] }

const initialState: AlertState = {
  alerts: []
};

@Injectable({
  providedIn: 'root'
})
export class AlertService extends Store<AlertState> {

  constructor(
    private readonly _http: HttpClient,
    private readonly _appSettings: AppSettingsService
  ) {
    super(initialState);
  }

  public getAlerts(): Observable<ApiResponseInterface<IAlert[]>> {
    const params = { method: 'index_all_alert' };
    return this._http.get<ApiResponseInterface<IAlert[]>>(
      this._appSettings.alerts.url.base,
      { params }
    ).pipe(
      tap(({ data }) => {
        this.setState(() => ({
          alerts: [...data || []]
        }));
      }));
  }

  public createAlerts(alertData: any): Observable<ApiResponseInterface<any>> {
    const params = { method: 'create_alert' };
    return this._http.post<ApiResponseInterface<any>>(
      this._appSettings.alerts.url.base,
      alertData,
      { params }
    ).pipe(
      tap(({ data }) => {
        this.setState(state => ({
          alerts: [...state.alerts, data]
        }));
      })
    );
  }

  public changeStatusAlert(alertId: number, statusAlert: boolean): Observable<ApiResponseInterface<any>> {
    const params = { method: 'enable_alert' };
    return this._http.put<ApiResponseInterface<any>>(
      `${this._appSettings.alerts.url.base}/${alertId}`,
      { statusAlert },
      { params }
    ).pipe(
      tap(({ data }) => {
        this.setState((state) => {
          const copyState = [...state.alerts];
          const alertData = copyState.find(({ id }) => id === +data.alertId);
          const index = copyState.indexOf(alertData);
          copyState.splice(index, 1, { ...alertData, status_alert: !alertData.status_alert });
          return {
            alerts: [...copyState]
          };
        });
      })
    );
  }
}
