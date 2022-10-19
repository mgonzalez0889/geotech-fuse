import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class DriverService {
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}
    /**
     * @description: Ver todos los conductores
     */
    public getDrivers(): Observable<any> {
        const params = { method: 'index_all_owner_driver' };
        return this._http.get(this._appSettings.driver.url.base, {
            params,
        });
    }
}
