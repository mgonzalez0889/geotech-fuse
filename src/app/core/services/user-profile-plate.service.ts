import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettingsService} from "../app-configs/app-settings.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserProfilePlateService {
  public behaviorSubjectUserProfilePlate$: BehaviorSubject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }> = new BehaviorSubject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>({type: '', isEdit: false, id: 0});
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene todos los user profile plate
   */
  public getUsersProfilePlate(): Observable<any> {
      const params = {method: 'index_all_user_profile_plate'};
      return this._http.get(this._appSettings.profile.url.profilePlate, {params});
  }
  /**
   * @description: Obtiene todos los plates del profile
   */
  public getUserProfilePlate(id: number): Observable<any> {
      const params = {method: 'index_all_user_profile_plate', user_profile_id: id};
      return this._http.get(`${this._appSettings.profile.url.profilePlate}`, {params});
  }
  /**
   * @description: Guarda un nuevo user profile plate
   */
  public postUserProfilePlate(data: any): Observable<any> {
      const params = {method: 'create_user_profile_plate'};
      return this._http.post(this._appSettings.profile.url.profilePlate, data, {params});
  }
  /**
   * @description: Elimina un plate del perfil de usuario
   */
  public deleteUserProfilePlate(id: number): Observable<any> {
      const params = {method: 'delete_user_profile_plate'};
      return this._http.delete(`${this._appSettings.profile.url.profilePlate}/${id}`, {params});
  }
}
