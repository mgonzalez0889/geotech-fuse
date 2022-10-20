import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class MapService {
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}

    /**
     * @description: Obtiene todos las geometrias, dependiendo de parametro type(routes, zones, punts)
     */
    public getGeometry(type: string): any {
        const params = { method: 'index_all_zones', type: type };
        return this._http.get(this._appSettings.owner_zone.url.base, {
            params,
        });
    }

    /**
     * @description: Guarda las geometrias, dependiendo de parametro type(routes, zones, punts)
     */
    public postGeometry(type: string, data: any): any {
        const params = { method: 'create_geozones', type: type };
        return this._http.post(this._appSettings.owner_zone.url.base, data, {
            params,
        });
    }
}
