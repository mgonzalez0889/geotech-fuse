import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMobiles } from '../interfaces/mobiles.interface';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { ApiResponseInterface } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class MobileService {

  private readyMobiles$: Subject<IMobiles[]> = new Subject();

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  get mobiles$(): Observable<IMobiles[]> {
    return this.readyMobiles$.asObservable();
  }

  /**
   * @description: Obtiene todos los moviles
   */
  public getMobiles(): Observable<ApiResponseInterface<IMobiles[]>> {
    const params = { method: 'index_all_mobile' };
    return this._http.get<ApiResponseInterface<IMobiles[]>>(
      this._appSettings.mobile.url.base,
      { params }
    ).pipe(tap(({ data }) => this.readyMobiles$.next(data)));
  }

  /**
   * @description: Obtiene detalle de un movil
   */
  public getDetailMobile(id: number): any {
    const params = { method: 'show_mobile' };
    return this._http.get(`${this._appSettings.mobile.url.base}/${id}`, {
      params,
    });
  }
  /**
   * @description: Crea un nuevo movil a la flota
   */
  public postMobile(data: any): Observable<ApiResponseInterface<any>> {
    const params = { method: 'create_mobile' };
    return this._http.post<ApiResponseInterface<any>>(
      this._appSettings.mobile.url.base,
      data,
      { params }
    );
  }
  /**
   * @description: Elimina los moviles de la flota
   */
  public deleteMobile(id: number): Observable<ApiResponseInterface<any>> {
    const params = { method: 'delete_mobile' };
    return this._http.delete<ApiResponseInterface<any>>(
      `${this._appSettings.mobile.url.base}/${id}`,
      { params }
    );
  }
}
