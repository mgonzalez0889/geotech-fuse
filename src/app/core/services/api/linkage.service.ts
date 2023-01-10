import { HttpClient } from '@angular/common/http';
import { Injectable, ComponentRef,   } from '@angular/core';
import { AppSettingsService } from 'app/core/app-configs/app-settings.service';
import { Observable, Subject ,  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkageService {
  activeInstances$: Subject<number> = new Subject();
  modalRef: ComponentRef<any>[] = [];
  public activeInstances: number;
  public userForm$: Subject<{ typeAction: 'add' | 'edit' | 'delete'; formData: any }> = new Subject();

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService,
  ) { }

   /**
    *@description: Creacion de usuario con perfil
    */
   public postUser(data: any): Observable<any> {
    const params = { method: 'create_user' };
    return this._http.post(this._appSettings.user.url.base, data, {
      params,
    });
  }
   /**
    * @description: Todos los usuarios
    */
   public getUsers(): Observable<any> {
    const params = { method: 'index_all_user' };
    return this._http.get(this._appSettings.user.url.base, { params });
  }

  public getUsersModal(): Observable<any> {
    const params = { method: 'index_all_user' };
    return this._http.get(this._appSettings.user.url.base, { params });


  }
}
