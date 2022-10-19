import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HistoriesService {
    public subjectHistories: BehaviorSubject<{ payload?: any }> =
        new BehaviorSubject({ payload: '' });

    // behavior reporte historico y eventos
    public behaviorSubjectDataGrid: BehaviorSubject<{ payload?: any }> =
        new BehaviorSubject({ payload: '' });

    public behaviorSubjectDataForms: BehaviorSubject<{ payload?: any }> =
        new BehaviorSubject({ payload: '' });

    // behavior reporte de viajes
    public behaviorSubjectDataGridTrip: BehaviorSubject<{ payload?: any }> =
        new BehaviorSubject({ payload: '' });

    public behaviorSubjectDataFormsTrip: BehaviorSubject<{ payload?: any }> =
        new BehaviorSubject({ payload: '' });

    public subjectDataHistories: BehaviorSubject<{
        payload?: any;
        show?: boolean;
    }> = new BehaviorSubject<any>({ payload: '', show: false });

    public subjectDataSelected: BehaviorSubject<{
        payload: any;
        select: boolean;
    }> = new BehaviorSubject<{ payload: any; select: boolean }>({
        payload: '',
        select: false,
    });

    public subjectDataSelectedDetail: BehaviorSubject<{
        payload: any;
        select: boolean;
    }> = new BehaviorSubject<{ payload: any; select: boolean }>({
        payload: '',
        select: false,
    });

    public eventShowModal$ = new EventEmitter<any>();
    public modalShowSelected$ = new EventEmitter<any>();
    public floatingMenuFleet$ = new EventEmitter<any>();
    public floatingMenuMobile$ = new EventEmitter<any>();
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}
    /**
     * @description: Obtiene el listado de historico
     */
    public getHistories(data: any): Observable<any> {
        const params = { method: 'create_historic' };
        return this._http.post(this._appSettings.histories.url.base, data, {
            params,
        });
    }

    /**
     * @description: Obtiene el listado de historico trip
     */
    public getHistoriesTrip(data: any): Observable<any> {
        const params = { method: 'create_historic_trip' };
        return this._http.post(this._appSettings.histories.url.base, data, {
            params,
        });
    }

    /**
     * @description: Obtiene el historico por vehiculo con paginacion
     */
    public getHistoricPlate(data: any): Observable<any> {
        const params = { method: 'create_report_historic' };
        return this._http.post(this._appSettings.histories.url.base, data, {
            params,
        });
    }
    /**
     * @description: Obtiene el historico por flota con paginacion
     */
    public getGistoricFleet(data: any): Observable<any> {
        const params = { method: 'create_report_historic_fleet' };
        return this._http.post(this._appSettings.histories.url.base, data, {
            params,
        });
    }
    /**
     * @description: Genera el reporte por vehiculo en .CSV
     */
    public getHistoricExportMovile(data: any): Observable<any> {
        const params = { method: 'create_report_historic_export' };
        return this._http.post(this._appSettings.histories.url.base, data, {
            params,
        });
    }
    /**
     * @description: Genera el reporte por flota en .CSV
     */
    public getHistoricExportFleet(data: any): Observable<any> {
        const params = { method: 'create_report_historic_fleet_export' };
        return this._http.post(this._appSettings.histories.url.base, data, {
            params,
        });
    }

    public subscribe(payload, show): void {
        const { payload: pl, show: isShow } =
            this.subjectDataHistories.getValue();
        if (pl === payload && isShow === show) {
            return;
        }
        this.subjectDataHistories.next({ payload, show });
    }
    /**
     * @description: Establece por defecto el observable behaviorSubject
     */
    public resetValuesDataHistories(): void {
        this.subjectDataHistories.next({ payload: '', show: false });
    }

    /**
     * @description: Establece por defecto el observable behaviorSubject
     */
    public resetDataSelected(): void {
        this.subjectDataSelected.next({ payload: '', select: false });
    }
}
