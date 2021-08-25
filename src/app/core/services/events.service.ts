import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import { Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EventsService {

    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {
    }

    /**
     * @description: Ver todos los eventos
     */
    public getEvents(): Observable<any> {
        const params = {method: 'index_all_event'};
        return this._http.get(this._appSettings.events.url.base, {params});
    }

    /**
     * @description: Guarda un eventos
     */
    public postEvents(data: any): Observable<any> {
        const params = {method: 'create_event'};
        return this._http.post(this._appSettings.events.url.base, data, {params});
    }

    /**
     * @description: Edita un eventos
     */
    public putEventes(data: any): Observable<any> {
        const params = {method: 'update_event'};
        const id = data.id;
        delete data.id;
        return this._http.put(this._appSettings.events.url.base + '/' + id, data, {params});
    }

}
