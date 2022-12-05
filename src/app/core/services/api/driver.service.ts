import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from '../../app-configs/app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  public behaviorSubjectDriverForm: BehaviorSubject<{
    payload?: any;
    id?: number;
    newDriver?: any;
    isEdit?: boolean;
  }> = new BehaviorSubject(null);
  public behaviorSubjectDriverGrid: BehaviorSubject<{
    reload?: boolean;
    opened?: boolean;
  }> = new BehaviorSubject({ reload: false, opened: false });
  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }
  /**
   * @description: Ver todos los conductores
   */
  public getDrivers(): Observable<any> {
    const params = { method: 'index_all_owner_driver' };
    return this._http.get(this._appSettings.driver.url.base, {
      params,
    });
  }

  /**
   * @description: Crear un conductor
   */
  public postDrivers(data: any): Observable<any> {
    const params = { method: 'create_owner_driver' };
    return this._http.post(this._appSettings.driver.url.base, data, {
      params,
    });
  }
  /**
   * @description: Eliminar un conductor
   */
  public deleteDrivers(id: number): Observable<any> {
    const params = { method: 'delete_owner_driver' };
    return this._http.delete(
      this._appSettings.driver.url.base + '/' + id,
      { params }
    );
  }
  /**
   * @description: Editar un conductor
   */
  public putDrivers(data: any): Observable<any> {
    const params = { method: 'update_owner_driver' };
    const id = data.id;
    delete data.id;
    return this._http.put(
      this._appSettings.driver.url.base + '/' + id,
      data,
      { params }
    );
  }
  /**
   * @description: Traer un conductor
   */
  public getDriver(id: number): Observable<any> {
    const params = { method: 'show_owner_driver' };
    return this._http.get(this._appSettings.driver.url.base + '/' + id, {
      params,
    });
  }
}
