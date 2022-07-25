import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EventsService {
    public behaviorSubjectEventForm: BehaviorSubject<{
        payload?: any;
        id?: number;
        isEdit?: boolean;
    }> = new BehaviorSubject(null);
    public behaviorSubjectEventGrid: BehaviorSubject<{
        reload?: boolean;
        opened?: boolean;
    }> = new BehaviorSubject({ reload: false, opened: false });

    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}

    /**
     * @description: Ver todos los eventos
     */
    public getEvents(): Observable<any> {
        const params = { method: 'index_all_owner_event' };
        return this._http.get(this._appSettings.events.url.base, { params });
    }
    /**
     * @description: Guarda un evento
     */
    public postEvents(data: any): Observable<any> {
        const params = { method: 'create_event' };
        return this._http.post(this._appSettings.events.url.base, data, {
            params,
        });
    }
    /**
     * @description: Edita un evento
     */
    public putEvents(data: any): Observable<any> {
        const params = { method: 'update_event' };
        const id = data.id;
        delete data.id;
        return this._http.put(
            this._appSettings.events.url.base + '/' + id,
            data,
            { params }
        );
    }
    /**
     * @description: Trae un evento
     */
    public getEvent(id: number): Observable<any> {
        const params = { method: 'show_event' };
        return this._http.get(this._appSettings.events.url.base + '/' + id, {
            params,
        });
    }
}
