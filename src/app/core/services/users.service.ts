import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public behaviorSubjectUser$: BehaviorSubject<{type?: string; isEdit?: boolean; payload?: any; id?: number}> = new BehaviorSubject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>({type: '', isEdit: false, id: 0});
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }

    /**
     * @description: Todos los usuarios
     */
    public getUsers(): Observable<any> {
        const params = {method: 'index_all_user'};
        return this._http.get(this._appSettings.user.url.base, {params});
    }
    /**
     * @description: Creacion de usuario con perfil
     */
    public postUser(data: any): Observable<any> {
        const params = {method: 'create_user'};
        return this._http.post(this._appSettings.user.url.base, data, {params});
    }
    /**
     * @description: Trae un usuario
     */
    public getUser(id: number): Observable<any> {
        const params = {method: 'show_user'};
        return this._http.get(`${this._appSettings.user.url.base}/${id}`, {params});
    }

}
