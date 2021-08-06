import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }
    /**
     * @description: Obtiene todos los perfiles
     */
    public getProfiles(): Observable<any> {
        return this._http.get(this._appSettings.profile.url.base).pipe(
            map((res: any) => {
                return res.data;
            })
        );
    }
}
