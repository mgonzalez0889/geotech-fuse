import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommandsService {
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}

    /**
     * @description: Trae los tipos de comandos
     */
    public getTypeCommands(): Observable<any> {
        const params = { method: 'index_all_command' };
        return this._http.get(this._appSettings.commands.url.base, { params });
    }
    /**
     * @description: Trae los comandos enviados por el usuario
     */
    public postSearchCommandsSend(data: any): Observable<any> {
        const params = { method: 'command_sents' };
        return this._http.post(this._appSettings.commands.url.base, data, {
            params,
        });
    }
    /**
     * @description: Envia comandos
     */
     public postCommandsSend(data: any): Observable<any> {
        const params = { method: 'sent_commands' };
        return this._http.post(this._appSettings.commands.url.base, data, {
            params,
        });
    }
}
