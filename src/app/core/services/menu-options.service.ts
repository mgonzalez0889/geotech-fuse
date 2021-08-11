import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {

  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }
    /**
     * @description: Todas las opciones de menu
     */
    public getMenuOptions(): Observable<any> {
        const params = {method: 'index_all_option'};
        return this._http.get(this._appSettings.menuOptions.url.base, {params});
    }
    /**
     * @description: Creacion de una nueva opcion de menu
     */
    public postMenuOption(data: any): Observable<any> {
        const params = {method: 'create_option'};
        return this._http.post(this._appSettings.menuOptions.url.base, data, {params});
    }
    /**
     * @description: Trae una opcion de menu
     */
    public getMenuOption(id: number): Observable<any> {
        const params = {method: 'show_option'};
        return this._http.get(`${this._appSettings.menuOptions.url.base}/${id}`, {params});
    }
    /**
     * @description: Edita una opcion de menu
     */
    public putMenuOption(data: any): Observable<any> {
        const params = {method: 'update_option'};
        const id = data.id;
        delete data.id;
        return this._http.put(`${this._appSettings.menuOptions.url.base}/${id}`, data, {params});
    }
    /**
     * @description: Elimina una opcion
     */
    public deleteMenuOption(id: number): Observable<any> {
        const params = {method: 'delete_option'};
        return this._http.delete(`${this._appSettings.menuOptions.url.base}/${id}`, {params});
    }
}
