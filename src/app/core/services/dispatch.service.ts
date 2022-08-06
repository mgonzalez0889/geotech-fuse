import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
    providedIn: 'root',
})
export class DispatchService {
    public behaviorSubjectDispatchForm: BehaviorSubject<{
        payload?: any;
        id?: number;
        newDispatch?: any;
        isEdit?: boolean;
    }> = new BehaviorSubject(null);
    public behaviorSubjectDispatchGrid: BehaviorSubject<{
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
    public getDispatches(data: any): Observable<any> {
        console.log(data, 'data');
        const params = { method: 'info_all_dispatches' };
        return this._http.post(this._appSettings.dispatch.url.base, data, {
            params,
        });
    }
    /**
     * @description: Traer un despacho
     */
    public getDispatch(id: number): Observable<any> {
        const params = { method: 'show_dispatch' };
        return this._http.get(this._appSettings.dispatch.url.base + '/' + id, {
            params,
        });
    }
    /**
     * @description: Editar un despacho
     */
    public putDispatch(data: any): Observable<any> {
        const params = { method: 'update_dispatch' };
        const id = data.id;
        delete data.id;
        return this._http.put(
            this._appSettings.dispatch.url.base + '/' + id,
            data,
            { params }
        );
    }
    /**
     * @description: Crear un despacho
     */
    public postDispatch(data: any): Observable<any> {
        const params = { method: 'create_dispatch' };
        return this._http.post(this._appSettings.dispatch.url.base, data, {
            params,
        });
    }
    /**
     * @description: Buscar los dispositivos aptos para crear un despacho
     */
    public getDevicesDispatch(): Observable<any> {
        const params = { method: 'index_all_dispatch_devices' };
        return this._http.get(this._appSettings.dispatch.url.base, {
            params,
        });
    }
}
