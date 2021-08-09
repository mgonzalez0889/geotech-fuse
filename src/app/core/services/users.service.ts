import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public subjectUser$: Subject<{type?: string, isEdit?: boolean, payload?: any; id?: number}> = new Subject();
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }

    /**
     * @description: Todos los usuarios
     */
    public getUsers(): Observable<any> {
        // const headers = new HttpHeaders().set('Authorization', 'Bearer kiw1cqD3PwKLMsKagRcBKWG2Sl66TNT4QJ3nPqkKNzE');
        return this._http.get(this._appSettings.user.url.base);
    }
    /**
     * @description: Creacion de usuario con perfil
     */
    public postUser(data: any): Observable<any> {
        return this._http.post(this._appSettings.user.url.base, data);
    }

}
