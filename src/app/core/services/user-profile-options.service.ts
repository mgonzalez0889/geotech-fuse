import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserProfileOptionsService {
  public behaviorSubjectUserProfile$: Subject<{type?: string; isEdit?: boolean; payload?: any; id?: number}> = new Subject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>();
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }
    /**
     * @description: Carga las opciones del perfil de usuario
     */
    public getUserOptionProfile(): Observable<any> {
        const params = {method: 'index_all_user_profile_option'};
        return this._http.get(this._appSettings.userProfileOption.url.base, {params});
    }
    /**
     * @description: Guarda una opcion de perfil usuario
     */
    public postUserProfileOption(data: any): Observable<any> {
        const params = {method: 'create_user_profile_option'};
        return this._http.post(this._appSettings.userProfileOption.url.base, data, {params});
    }
}
