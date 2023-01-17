import { HttpClient } from '@angular/common/http';
import { Injectable,    } from '@angular/core';
import { AppSettingsService } from 'app/core/app-configs/app-settings.service';
import { BehaviorSubject, Observable, Subject,   } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkageService {

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService,
  ) { }

   /**
    *@description solicitud buscar clientes para vinculacion contrato
    */
   public getSearchClient(nit: string): Observable<any> {
    const params = { method: 'index_all_con_cliet', nit };
    return this._http.get(this._appSettings.con_client.url.base, { params });
  }

  /**
   * @description: Crear un cliente
   */
  public postClient(data: any): Observable<any> {
    const params = { method: 'create_client_firm', };
    return this._http.post(this._appSettings.client_firm.url.base, data, {
      params,
    });
  }
  /**
   * @description: lee todos los clientes
   */

  public getClients(): Observable<any> {
    const params = { method: 'index_client_firm_all' };
    return this._http.get(this._appSettings.client_firm.url.base, { params });
  }
}


