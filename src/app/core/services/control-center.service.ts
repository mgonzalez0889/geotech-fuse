import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class ControlCenterService {
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}

    /**
     * @description: Todos las alarmas
     */
    public getAllAlarms(): Observable<any> {
        const params = { method: 'index_all_alarms' };
        return this._http.get(this._appSettings.controlCenter.url.base, {
            params,
        });
    }
}
