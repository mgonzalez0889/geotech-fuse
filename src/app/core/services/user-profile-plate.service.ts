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
  public getUserProfilePlate(): Observable<any> {
      const params = {method: 'index_all_owner_plate'};
      return this._http.get(this._appSettings.plateOptions.url.base, {params});
  }
  /**
   * @description: Guarda un nuevo user profile plate
   */
  public postUserProfilePlate(data: any): Observable<any> {
      const params = {method: 'index_all_user_profile'};
      return this._http.post(this._appSettings.plateOptions.url.base, data, {params});
  }
  /**
   * @description: Actualiza el user profile plate
   */
  public putUserProfilePlate(data: any): Observable<any> {
      const params = {method: 'index_all_user_profile'};
      const id = data.id;
      delete data.id;
      return this._http.put(`${this._appSettings.plateOptions.url.base}/${id}`, data, {params});
  }
}
