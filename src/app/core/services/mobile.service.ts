import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from "../interfaces/api-response.interface";
import { MobilesInterface } from "../interfaces/mobiles.interface";

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene todos los moviles
   */
  public getMobiles(): Observable<ApiResponseInterface<MobilesInterface[]>> {
    const params = { method: 'index_all_mobile' };
    return this._http.get<ApiResponseInterface<MobilesInterface[]>>(this._appSettings.mobile.url.base, { params });
  }

  /**
   * @description: Obtiene detalle de un movil
   */
  public getDetailMobile(id: number) {
    const params = { method: 'show_mobile' };
    return this._http.get(`${this._appSettings.mobile.url.base}/${id}`, { params });
  }
  /**
   * @description: Crea un nuevo movil a la flota
   */
  public postMobile(data: any): Observable<ApiResponseInterface<any>> {
    const params = { method: 'create_mobile' };
    return this._http.post<ApiResponseInterface<any>>(this._appSettings.mobile.url.base, data, { params });
  }
  /**
   * @description: Elimina los moviles de la flota
   */
  public deleteMobile(id: number): Observable<ApiResponseInterface<any>> {
    const params = { method: 'delete_mobile' };
    return this._http.delete<ApiResponseInterface<any>>(`${this._appSettings.mobile.url.base}/${id}`, { params });
  }
}
