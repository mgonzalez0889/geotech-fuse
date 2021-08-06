import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

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

}
