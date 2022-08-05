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
    /**
     * @description: Traer un despacho
     */
    public getDispath(id: number): Observable<any> {
        const params = { method: 'show_dispath' };
        return this._http.get(this._appSettings.dispath.url.base + '/' + id, {
            params,
        });
    }
    /**
     * @description: Editar un despacho
     */
    public putDispath(data: any): Observable<any> {
        const params = { method: 'update_dispath' };
        const id = data.id;
        delete data.id;
        return this._http.put(
            this._appSettings.dispath.url.base + '/' + id,
            data,
            { params }
        );
    }
    /**
     * @description: Crear un despacho
     */
    public postDispath(data: any): Observable<any> {
        const params = { method: 'create_dispath' };
        return this._http.post(this._appSettings.dispath.url.base, data, {
            params,
        });
    }
}
