/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { Observable, Subject } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  public userForm$: Subject<{ typeAction: 'add' | 'edit' | 'delete'; formData: any }> = new Subject();

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService,
    private permissionsService: NgxPermissionsService
  ) { }


  getUserPermission(idProfile: number): Observable<any> {
    const params = { method: 'show_user_profile' };
    return this._http.get(`${this._appSettings.profile.url.base}/${idProfile}`, { params });
  }

  assingPermission(): void {
    const profile = JSON.parse(localStorage.getItem('infoUser'));
    this.getUserPermission(profile.user_profile_id).subscribe(({ data }) => {
      this.permissionsService.addPermission(data.permission);
    });
  }

  validUsername(value: string): Observable<any> {
    const params = { method: 'validator_user' };
    const body = { user_login: value };
    return this._http.post(this._appSettings.user.url.base, body, { params });
  }

  /**
   * @description: Todos los usuarios
   */
  public getUsers(): Observable<any> {
    const params = { method: 'index_all_user' };
    return this._http.get(this._appSettings.user.url.base, { params });
  }

  /**
   * @description: Creacion de usuario con perfil
   */
  public postUser(data: any): Observable<any> {
    const params = { method: 'create_user' };
    return this._http.post(this._appSettings.user.url.base, data, {
      params,
    });
  }

  /**
   * @description: Trae un usuario
   */
  public getUser(id: number): Observable<any> {
    const params = { method: 'show_user' };
    return this._http.get(`${this._appSettings.user.url.base}/${id}`, {
      params,
    });
  }

  /**
   * @description: Edita el usuario
   */
  public putUser(data: any): Observable<any> {
    const params = { method: 'update_user' };
    const id = data.id;
    delete data.id;
    return this._http.put(
      `${this._appSettings.user.url.base}/${id}`,
      data,
      { params }
    );
  }

  /**
   * @description: Elimina un usuario
   */
  public deleteUser(id: number): Observable<any> {
    const params = { method: 'delete_user' };
    return this._http.delete(`${this._appSettings.user.url.base}/${id}`, {
      params,
    });
  }

  /**
   * @description: Informacion del usuario logueado
   */
  public getInfoUser(): Observable<any> {
    const params = { method: 'info_user' };
    return this._http.get(this._appSettings.user.url.base, { params });
  }

  /**
   * @description: Cambia el owner Id simulator
   */
  public putUserOwnerSimulator(data: any): Observable<any> {
    const params = { method: 'update_owner_id_simulator' };
    return this._http.get(this._appSettings.user.url.base + '/' + data.id, {
      params,
    });
  }
}
