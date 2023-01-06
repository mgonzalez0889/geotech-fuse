import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { ApiResponseInterface, IMobiles } from '@interface/index';
import { Store } from '@tools/store.tool';

interface MobilesState { mobiles: IMobiles[] }

const initialState: MobilesState = {
  mobiles: []
};

@Injectable({
  providedIn: 'root',
})
export class MobileService extends Store<MobilesState> {
  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) {
    super(initialState);
  }

  /**
   * @description: Obtiene todos los moviles
   */
  public getMobiles(): Observable<ApiResponseInterface<IMobiles[]>> {
    const params = { method: 'index_all_mobile' };
    return this._http.get<ApiResponseInterface<IMobiles[]>>(
      this._appSettings.mobile.url.base,
      { params }
    ).pipe(tap(({ data }) => {
      this.setState(() => ({
        mobiles: [...data || []]
      }));
    }));
  }

  /**
   * @description: Obtiene detalle de un movil
   */
  public getDetailMobile(id: number): Observable<any> {
    const params = { method: 'show_mobile' };
    return this._http.get(`${this._appSettings.mobile.url.base}/${id}`, {
      params,
    });
  }
}
