import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from '../../app-configs/app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class ControlCenterService {
  public behaviorSubjectContactForm: BehaviorSubject<{
    payload?;
    ownerId?: number;
    id?: number;
    newContact?: any;
    isEdit?: boolean;
    isAttended?: boolean;
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
   * @description: Todos las alarmas
   */
  public getAllAlarms(filter: number): Observable<any> {
    const params = { method: 'index_all_alarms', filterAlarms: filter };
    return this._http.get(this._appSettings.controlCenter.url.base, {
      params,
    });
  }
  /**
   * @description: Todos las alarmas owner
   */
  public getAllAlarmsOwner(filter: number): Observable<any> {
    const params = { method: 'index_all_alarms', filterAlarms: filter };
    return this._http.get(this._appSettings.controlCenterOwner.url.base, {
      params,
    });
  }
  /**
   * @description: Todos los contactos de centro de control
   */
  public getContactsControlCenter(id: number): Observable<any> {
    const params = { method: 'index_all_contact', owner_id: id };
    return this._http.get(
      this._appSettings.contactsControlCenter.url.base,
      {
        params,
      }
    );
  }
  /**
   * @description: Todos los contactos de centro de control owner
   */
  public getContactsControlCenterOwner(id: number): Observable<any> {
    const params = { method: 'index_all_contact', owner_id: id };
    return this._http.get(
      this._appSettings.contactsControlCenterOwner.url.base,
      {
        params,
      }
    );
  }
  /**
   * @description: Todos los estado de atencion de alarmas
   */
  public getTypeContactsControlCenter(): Observable<any> {
    const params = { method: 'index_all_type_contact' };
    return this._http.get(
      this._appSettings.typeContactsControlCenter.url.base,
      {
        params,
      }
    );
  }
  /**
   * @description: Todos los estado de atencion de alarmas
   */
  public getAllStatusAttends(): Observable<any> {
    const params = { method: 'index_all_alarm_status_attens' };
    return this._http.get(this._appSettings.controlCenter.url.base, {
      params,
    });
  }
  /**
   * @description: Todos las causales de la alarmas
   */
  public getAllCausalAttends(): Observable<any> {
    const params = { method: 'index_all_causals_alarm_attens' };
    return this._http.get(this._appSettings.controlCenter.url.base, {
      params,
    });
  }
  /**
   * @description: Atender alarmas
   */
  public postAttendAlarm(data: any): Observable<any> {
    const params = { method: 'detail_alarm_attention' };
    delete data.postponeAlarmHour;
    delete data.postponeAlarmDate;
    return this._http.post(this._appSettings.controlCenter.url.base, data, {
      params,
    });
  }
  /**
   * @description: Atender alarmas owner
   */
  public postAttendAlarmOwner(data: any): Observable<any> {
    const params = { method: 'detail_alarm_attention' };
    delete data.postponeAlarmHour;
    delete data.postponeAlarmDate;
    return this._http.post(
      this._appSettings.controlCenterOwner.url.base,
      data,
      {
        params,
      }
    );
  }

  /**
   * @description: Crear un contacto
   */
  public postContacts(data: any): Observable<any> {
    const params = { method: 'create_contact' };
    return this._http.post(
      this._appSettings.contactsControlCenter.url.base,
      data,
      {
        params,
      }
    );
  }
  /**
   * @description: Crear un contacto owner
   */
  public postContactsOwner(data: any): Observable<any> {
    const params = { method: 'create_contact' };
    return this._http.post(
      this._appSettings.contactsControlCenterOwner.url.base,
      data,
      {
        params,
      }
    );
  }
  /**
   * @description: Eliminar un contacto
   */
  public deleteContacts(id: number): Observable<any> {
    const params = { method: 'delete_contact' };
    return this._http.delete(
      this._appSettings.contactsControlCenter.url.base + '/' + id,
      { params }
    );
  }
  /**
   * @description: Eliminar un contacto owner
   */
  public deleteContactsOwner(id: number): Observable<any> {
    const params = { method: 'delete_contact' };
    return this._http.delete(
      this._appSettings.contactsControlCenterOwner.url.base + '/' + id,
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
      this._appSettings.contactsControlCenter.url.base + '/' + id,
      data,
      { params }
    );
  }
  /**
   * @description: Editar un contacto owner
   */
  public putContactsOwner(data: any): Observable<any> {
    const params = { method: 'update_contact' };
    const id = data.id;
    delete data.id;
    return this._http.put(
      this._appSettings.contactsControlCenterOwner.url.base + '/' + id,
      data,
      { params }
    );
  }
  /**
   * @description: Traer un contacto
   */
  public getContact(id: number): Observable<any> {
    const params = { method: 'show_contact' };
    return this._http.get(
      this._appSettings.contactsControlCenter.url.base + '/' + id,
      {
        params,
      }
    );
  }
  /**
   * @description: Traer un contacto owner
   */
  public getContactOwner(id: number): Observable<any> {
    const params = { method: 'show_contact' };
    return this._http.get(
      this._appSettings.contactsControlCenterOwner.url.base + '/' + id,
      {
        params,
      }
    );
  }
  /**
   * @description: Pasar una alarma a seguimiento
   */
  public getInitAttention(id: number): Observable<any> {
    const params = { method: 'init_alarm_attention' };
    return this._http.get(
      this._appSettings.controlCenter.url.base + '/' + id,
      {
        params,
      }
    );
  }
  /**
   * @description: Pasar una alarma a seguimiento owners
   */
  public getInitAttentionOwner(id: number): Observable<any> {
    const params = { method: 'init_alarm_attention' };
    return this._http.get(
      this._appSettings.controlCenterOwner.url.base + '/' + id,
      {
        params,
      }
    );
  }
  /**
   * @description: Generar un reporte de alarmas atendidas
   */
  public postReportAlarmsAttens(data: any): Observable<any> {
    const params = { method: 'report_alarms_attens' };
    return this._http.post(this._appSettings.controlCenter.url.base, data, {
      params,
    });
  }
  /**
   * @description: Generar un reporte de alarmas atendidas owner
   */
  public postReportAlarmsAttensOwner(data: any): Observable<any> {
    const params = { method: 'report_alarms_attens' };
    return this._http.post(
      this._appSettings.controlCenterOwner.url.base,
      data,
      {
        params,
      }
    );
  }
}
