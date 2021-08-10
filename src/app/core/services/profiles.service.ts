import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../app-configs/app-settings.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  public behaviorSubjectProfile$: BehaviorSubject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }> = new BehaviorSubject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>({type: '', isEdit: false, id: 0});
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }
    /**
     * @description: Obtiene todos los perfiles
     */
    public getProfiles(): Observable<any> {
        const params = {method: 'index_all_user_profile'};
        return this._http.get(this._appSettings.profile.url.base, {params}).pipe(
            map((res: any) => res.data)
        );
    }
    /**
     * @description: Creacion de perfil
     */
    public postProfile(data: any): Observable<any> {
        const params = {method: 'create_user_profile'};
        return this._http.post(this._appSettings.profile.url.base, data, {params});
    }
    /**
     * @description: Trae un perfil
     */
    public getProfile(id: number): Observable<any> {
        const params = {method: 'show_user_profile'};
        return this._http.get(`${this._appSettings.profile.url.base}/${id}`, {params});
    }
    /**
     * @description: Edita un perfil
     */
    public putProfile(data: any): Observable<any> {
        const params = {method: 'update_user_profile'};
        const id = data.id;
        delete data.id;
        return this._http.put(`${this._appSettings.profile.url.base}/${id}`, data, {params});
    }
    /**
     * @description: Elimina un perfil
     */
    public deleteProfile(id: number): Observable<any> {
        const params = {method: 'delete_user_profile'};
        return this._http.delete(`${this._appSettings.profile.url.base}/${id}`, {params});
    }
}
