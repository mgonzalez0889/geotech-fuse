import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../app-configs/app-settings.service';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HistoriesService {
  public subjectHistories: BehaviorSubject<{payload: any}> = new BehaviorSubject({payload: ''});
  public subjectDataHistories: BehaviorSubject<{payload: any; show: boolean}> = new BehaviorSubject<any>({payload: '', show: false});
  public subjectDataSelected: BehaviorSubject<{payload: any; select: boolean}> = new BehaviorSubject<{payload: any; select: boolean}>({payload: '', select: false});
  public eventShowModal$ = new EventEmitter<any>();
  public modalShowSelected$ = new EventEmitter<any>();
  public floatingMenuFleet$ = new EventEmitter<any>();
  public floatingMenuMobile$ = new EventEmitter<any>();
  constructor(
      private _http: HttpClient,
      private _appSettings: AppSettingsService
  ) { }
    /**
     * @description: Obtiene el listado de historico
     */
    public getHistories(data: any): Observable<any> {
        const params = {method: 'create_historic'};
        return this._http.post(this._appSettings.histories.url.base, data, {params});
    }

    public subscribe(payload, show): void {
        const {payload: pl, show: isShow} = this.subjectDataHistories.getValue();
        if (pl == payload && isShow == show) {
            return;
        }
        this.subjectDataHistories.next({payload, show});
    }

    public resetValuesDataHistories(): void {
        this.subjectDataHistories.next({payload: '', show: false});
    }

    public resetDataSelected(): void {
        this.subjectDataSelected.next({payload: '', select: false});
    }


}
