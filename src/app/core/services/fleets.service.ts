import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FleetsService {
    public behaviorSubjectFleet$: BehaviorSubject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }> = new BehaviorSubject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }>({ type: '', isEdit: false, id: 0 });
    public behaviorSubjectUserOwnerPlateFleet$: BehaviorSubject<{ type?: string; isEdit?: boolean; payload?: any; id?: number }> = new BehaviorSubject<{type?: string; isEdit?: boolean; payload?: any; id?: number}>({type: '', isEdit: false, id: 0});
    public behaviorSelectedFleetPlate$: Subject<{id?: number; payload?: any; selected?: boolean}> = new Subject<{id?: number; payload?: any; selected?: boolean}>();

    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) { }
    /**
     * @description: Ver todos las flotas
     */
    public getFleets(): Observable<any> {
        const params = { method: 'index_all_fleet' };
        return this._http.get(this._appSettings.fleets.url.base, { params });
    }
    /**
     * @description: Crear una flota
     */
    public postFleets(data: any): Observable<any> {
        const params = { method: 'create_fleet' };
        return this._http.post(this._appSettings.fleets.url.base, data, { params });
    }
    /**
     * @description: Eliminar una flota
     */
    public deleteFleets(id: number): Observable<any> {
        const params = { method: 'delete_fleet' };
        return this._http.delete(this._appSettings.fleets.url.base + '/' + id, { params });
    }
    /**
     * @description: Editar una flota
     */
    public putFleets(data: any): Observable<any> {
        const params = { method: 'update_fleet' };
        const id = data.id;
        delete data.id;
        return this._http.put(this._appSettings.fleets.url.base + '/' + id, data, { params });
    }
    /**
     * @description: Traer una sola flota
     */
    public getFleet(id: number): Observable<any> {
        const params = { method: 'show_fleet' };
        return this._http.get(this._appSettings.fleets.url.base + '/' + id, { params });
    }
    /**
     * @description: Obtiene las flotas por Id
     */
    public getFleetsPlatesAssigned(id: number): Observable<any> {
        const params = { method: 'index_all_fleet_plate', fleet_id: id };
        return this._http.get(this._appSettings.fleets.url.fleePlate, {params});
    }
    /**
     * @description:
     */
    public getFleetsPlateAssignedMap(id: number): Observable<any> {
        const params = { method: 'index_all_fleet_plate_map', fleet_id: id };
        return this._http.get(this._appSettings.fleets.url.fleePlate, {params});
    }
    /**
     * @description: Crear una flota
     */
    public postFleetsPlate(data: any): Observable<any> {
        const params = { method: 'create_fleet_plate' };
        return this._http.post(this._appSettings.fleets.url.fleePlate, data, { params });
    }
    /**
     * @description: Elimina una placa de la flota
     */
    public deleteFleetsPlate(id: number): Observable<any> {
        const params = { method: 'delete_fleet_plate' };
        return this._http.delete(`${this._appSettings.fleets.url.fleePlate}/${id}`, {params});
    }
}
