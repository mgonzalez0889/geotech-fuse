import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../app-configs/app-settings.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }
    /**
     * @description: Trae todos los projects
     */
    public getProjects(): Observable<any> {
        const params = {method: 'index_all_project'};
        return this._http.get(this._appSettings.projects.url.base, {params});
    }
}
