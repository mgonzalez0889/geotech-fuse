import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@tools/store.tool';
import { tap } from 'rxjs/operators';

interface ModulesState { modules: any[] }

const initialState: ModulesState = {
  modules: []
};

@Injectable({
  providedIn: 'root',
})
export class MenuOptionsService extends Store<ModulesState> {
  public behaviorSubjectMenuForm: BehaviorSubject<{
    payload?: any;
    id?: number;
    newOption?: any;
    isEdit?: boolean;
  }> = new BehaviorSubject(null);
  public behaviorSubjectMenuGrid: BehaviorSubject<{
    reload?: boolean;
    opened?: boolean;
  }> = new BehaviorSubject({ reload: false, opened: false });

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) {
    super(initialState);
  }

  /**
   * @description: Todas las opciones de menu (mejora)
   */
  public getMenuOptionProfile(profileId: number): Observable<any> {
    const params = { method: 'show_user_profile' };
    return this._http.get(`${this._appSettings.menuOptions.url.base}/${profileId}`, {
      params,
    });
  }

  /**
   * @description: Todas las opciones de menu (mejora)
   */
  public getMenuOptionsNew(): Observable<any> {
    const params = { method: 'index_all_new_options' };
    return this._http.get(this._appSettings.menuOptions.url.base, {
      params,
    }).pipe(
      tap(({ data }) => {
        this.setState(() => ({
          modules: [...data || []]
        }));
      })
    );
  }

  /**
   * @description: Creacion de una nueva opcion de menu
   */
  public postMenuOption(data: any): Observable<any> {
    const params = { method: 'create_option' };
    return this._http.post(this._appSettings.menuOptions.url.base, data, {
      params,
    });
  }

  /**
   * @description: Trae una opcion de menu
   */
  public getMenuOption(id: number): Observable<any> {
    const params = { method: 'show_option' };
    return this._http.get(
      `${this._appSettings.menuOptions.url.base}/${id}`,
      { params }
    );
  }

  /**
   * @description: Edita una opcion de menu
   */
  public putMenuOption(data: any): Observable<any> {
    const params = { method: 'update_option_new' };
    const id = data.id;
    delete data.id;
    return this._http.put(
      `${this._appSettings.menuOptions.url.base}/${id}`,
      data,
      { params }
    );
  }
  /**
   * @description: Elimina una opcion
   */
  public deleteMenuOption(id: number): Observable<any> {
    const params = { method: 'delete_option' };
    return this._http.delete(
      `${this._appSettings.menuOptions.url.base}/${id}`,
      { params }
    );
  }
}
