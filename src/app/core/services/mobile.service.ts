import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../app-configs/app-settings.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene todos los mobiles
   */
  public getMobiles(): Observable<any> {
      const params = {method: 'index_all_mobile'};
      return this._http.get(this._appSettings.mobile.url.base, {params});
  }
  /**
   * @description: Crea un nuevo movil a la flota
   */
  public postMobile(data: any): Observable<any> {
      const params = {method: 'create_mobile'};
      return this._http.post(this._appSettings.mobile.url.base, data , {params});
  }
  /**
   * @description: Elimina los moviles de la flota
   */
  public deleteMobile(id: number): Observable<any> {
      const params = {method: 'delete_mobile'};
      return this._http.delete(`${this._appSettings.mobile.url.base}/${id}`, {params});
  }
}
