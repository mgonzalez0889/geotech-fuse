import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OwnerPlateService {

  public behaviorSubjectMobileGrid: BehaviorSubject<{
    reload?: boolean;
    opened?: boolean;
  }> = new BehaviorSubject({ reload: false, opened: false });
  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }


  /**
   * @description: Obtiene la informacion de una placa del cliente
   */
  public getInfoOwnerPlate(id: any): Observable<any> {
    const params = { method: 'show_owner_plate' };
    return this._http.get(
      `${this._appSettings.ownerPlate.url.base}/${id}`,
      {
        params,
      }
    );
  }

  public putOwnerPlate(data: any, mobileId: number): Observable<any> {
    const params = { method: 'update_owner_plate' };
    return this._http.put<any>(
      `${this._appSettings.ownerPlate.url.base}/${mobileId}`,
      data,
      { params }
    );
  }

  /**
   * @description: Obtiene la informacion de una placa del cliente
   */
  public getTypePlate(): Observable<any> {
    const params = { method: 'index_all_type_mobile' };
    return this._http.get(this._appSettings.typeMobile.url.base, {
      params,
    });
  }
}
