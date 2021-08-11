import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AppSettingsService} from '../app-configs/app-settings.service';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ContactService {

    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {
    }

    /**
     * @description: Todos los contactos
     */
    public getContact(): Observable<any> {
        const params = {method: 'index_all_contact'};
        return this._http.get(this._appSettings.contact.url.base, {params});
    }

    /**
     * @description: Crear un contacto
     */
    public postContacts(data: any): Observable<any> {
        const params = {method: 'create_contact'};
        return this._http.post(this._appSettings.contact.url.base,data,{params});

    }

}
