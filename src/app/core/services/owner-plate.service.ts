import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../app-configs/app-settings.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerPlateService {
  public behaviorSubjectUserOwnerPlate$: BehaviorSubject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }> = new BehaviorSubject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>({type: '', isEdit: false, id: 0});
  public subjectUserOwnerPlate$: Subject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }> = new Subject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>();
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Obtiene todos los owner plate por profile
   */
  public getOwnerPlates(): Observable<any> {
      const params = {method: 'index_all_owner_plate_user_profile'};
      return this._http.get(this._appSettings.ownerPlate.url.base, {params});
  }
  /**
   * @description: Obtiene todas
   */
  public getOwnerPlatesFleet(id: number): Observable<any> {
      const params = {method: 'index_all_owner_plate_fleet', fleet_id: id};
      return this._http.get(this._appSettings.ownerPlate.url.base, {params});
  }
  /**
   * @description: Guarda una nueva placa
   */
  public postOwnerPlate(data: any): Observable<any> {
      const params = {method: 'create_owner_plate'};
      return this._http.post(this._appSettings.ownerPlate.url.base, data, {params});
  }

}
