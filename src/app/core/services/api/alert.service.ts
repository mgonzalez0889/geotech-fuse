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

}
