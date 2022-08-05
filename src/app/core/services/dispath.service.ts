import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class DispathService {
    public behaviorSubjectDispathForm: BehaviorSubject<{
        payload?: any;
        id?: number;
        newDispath?: any;
        isEdit?: boolean;
    }> = new BehaviorSubject(null);
    public behaviorSubjectDispathGrid: BehaviorSubject<{
        reload?: boolean;
        opened?: boolean;
    }> = new BehaviorSubject({ reload: false, opened: false });
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}
    /**
     * @description: Ver todos los despachos
     */
    public getDispaths(): Observable<any> {
        const params = { method: 'index_all_dispath' };
        return this._http.get(this._appSettings.dispath.url.base, { params });
    }
}
