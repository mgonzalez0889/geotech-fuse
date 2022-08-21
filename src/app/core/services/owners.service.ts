import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OwnersService {
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}
    /**
     * @description: Carga todos los owners
     */
    public getOwners(): Observable<any> {
        const params = { method: 'index_all_owner' };
        return this._http.get(this._appSettings.owners.url.base, { params });
    }
}
