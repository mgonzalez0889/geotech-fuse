import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-configs/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private _http:HttpClient,
    private _appSettings: AppSettingsService
  ) { }

  /**
   * @description: Todos los contactos
   */
  public getContact(){
    const params ={method: ''};
    return this._http.get(this._appSettings.contact.url.base,{params})
  }
  /**
   * @description: Traer un contacto
   */
  public postContact(){
    
  }
}
