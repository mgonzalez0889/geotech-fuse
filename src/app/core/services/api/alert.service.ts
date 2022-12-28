import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponseInterface, IAlert } from '@interface/index';
import { AppSettingsService } from '../../app-configs/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _appSettings: AppSettingsService
  ) { }

  public getAlerts(): Observable<ApiResponseInterface<IAlert[]>> {
    const params = { method: 'index_all_alert' };
    return this._http.get<ApiResponseInterface<IAlert[]>>(this._appSettings.alerts.url.base, { params });
  }

}
