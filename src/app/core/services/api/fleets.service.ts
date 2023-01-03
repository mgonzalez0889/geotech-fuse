import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../../app-configs/app-settings.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FleetInterface } from '@interface/index';
import { Store } from '@tools/store.tool';
import { tap } from 'rxjs/operators';
import { CommonTools } from '@tools/common.tool';

interface FleetState { fleets: FleetInterface[] }

const initialState: FleetState = {
  fleets: []
};

@Injectable({
  providedIn: 'root',
})
export class FleetsService extends Store<FleetState> {
  public behaviorSubjectFleetForm: BehaviorSubject<{
    payload?: any;
    id?: number;
    newFleet?: any;
    isEdit?: boolean;
  }> = new BehaviorSubject(null);
  public behaviorSubjectFleetGrid: BehaviorSubject<{
    reload?: boolean;
    opened?: boolean;
  }> = new BehaviorSubject({ reload: false, opened: false });

  constructor(
    private _http: HttpClient,
    private _appSettings: AppSettingsService,
    private commonTool: CommonTools
  ) {
    super(initialState);
  }

  /**
   * @description: Ver todos las flotas
   */
  public getFleets(): Observable<any> {
    const params = { method: 'index_all_fleet' };
    return this._http.get(this._appSettings.fleets.url.base, { params })
      .pipe(tap(({ data }) => {
        this.setState(() => ({
          fleets: [...data || []]
        }));
      }));
  }

  /**
   * @description: Crear una flota
   */
  public postFleets(data: any): Observable<any> {
    const params = { method: 'create_fleet' };
    return this._http.post(this._appSettings.fleets.url.base, data, {
      params,
    });
  }

  /**
   * @description: Eliminar una flota
   */
  public deleteFleets(id: number): Observable<any> {
    const params = { method: 'delete_fleet' };
    return this._http.delete(this._appSettings.fleets.url.base + '/' + id, {
      params,
    }).pipe(
      tap(() => {
        this.setState(({ fleets }) => {
          const fleetsState = this.commonTool.deleteItemArray<FleetInterface>(fleets, id);
          return { fleets: fleetsState };
        });
      }));
  }

  /**
   * @description: Editar una flota
   */
  public putFleets(data: any): Observable<any> {
    const params = { method: 'update_fleet' };
    const id = data.id;
    delete data.id;
    return this._http.put(
      this._appSettings.fleets.url.base + '/' + id,
      data,
      { params }
    );
  }

}
