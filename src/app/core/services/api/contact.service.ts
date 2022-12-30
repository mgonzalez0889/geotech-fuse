import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  public behaviorSubjectContactForm: BehaviorSubject<{
    payload?: any;
    id?: number;
    newContact?: any;
    isEdit?: boolean;
  }> = new BehaviorSubject(null);
  public behaviorSubjectContactGrid: BehaviorSubject<{
    reload?: boolean;
    opened?: boolean;
  }> = new BehaviorSubject({ reload: false, opened: false });

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Ver todos los contactos
   */
  public getContacts(): Observable<any> {
    const params = { method: 'index_all_contact' };
    return this._http.get(this._appSettings.contact.url.base, { params });
  }
  /**
   * @description: Crear un contacto
   */
  public postContacts(data: any): Observable<any> {
    const params = { method: 'create_contact' };
    return this._http.post(this._appSettings.contact.url.base, data, {
      params,
    });
  }
  /**
   * @description: Eliminar un contacto
   */
  public deleteContacts(id: number): Observable<any> {
    const params = { method: 'delete_contact' };
    return this._http.delete(
      this._appSettings.contact.url.base + '/' + id,
      { params }
    );
  }
  /**
   * @description: Editar un contacto
   */
  public putContacts(data: any): Observable<any> {
    const params = { method: 'update_contact' };
    const id = data.id;
    delete data.id;
    return this._http.put(
      this._appSettings.contact.url.base + '/' + id,
      data,
      { params }
    );
  }
  /**
   * @description: Traer un contacto
   */
  public getContact(id: number): Observable<any> {
    const params = { method: 'show_contact' };
    return this._http.get(this._appSettings.contact.url.base + '/' + id, {
      params,
    });
  }
}
