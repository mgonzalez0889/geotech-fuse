import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from '../app-configs/app-settings.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OwnerPlateService {
    public behaviorSubjectMobileForm: BehaviorSubject<{
        payload?: any;
        id?: number;
        isEdit?: boolean;
    }> = new BehaviorSubject(null);
    public behaviorSubjectMobileGrid: BehaviorSubject<{
        reload?: boolean;
        opened?: boolean;
    }> = new BehaviorSubject({ reload: false, opened: false });
    constructor(
        private _http: HttpClient,
        private _appSettings: AppSettingsService
    ) {}

    /**
     * @description: Obtiene todos los owner plate por profile
     */
    public getOwnerPlates(): Observable<any> {
        const params = { method: 'index_all_owner_plate_user_profile' };
        return this._http.get(this._appSettings.ownerPlate.url.base, {
            params,
        });
    }
    /**
     * @description: Obtiene todos los owner plate de un profile
     */
    public getOwnerPlatesUserProfile(id: number): Observable<any> {
        const params = {
            method: 'index_all_owner_plate_user_profile',
            user_profile_id: id,
        };
        return this._http.get(this._appSettings.ownerPlate.url.base, {
            params,
        });
    }
    /**
     * @description: Obtiene todas
     */
    public getOwnerPlatesFleet(id: number): Observable<any> {
        const params = { method: 'index_all_owner_plate_fleet', fleet_id: id };
        return this._http.get(this._appSettings.ownerPlate.url.base, {
            params,
        });
    }
    /**
     * @description: Guarda una nueva placa
     */
    public postOwnerPlate(data: any): Observable<any> {
        const params = { method: 'create_owner_plate' };
        return this._http.post(this._appSettings.ownerPlate.url.base, data, {
            params,
        });
    }
    /**
     * @description: Obtiene la informacion de una placa del cliente
     */
    public getInfoOwnerPlate(id: any): Observable<any> {
        const params = { method: 'show_owner_plate_driver' };
        return this._http.get(
            `${this._appSettings.ownerPlate.url.base}/${id}`,
            {
                params,
            }
        );
    }
    /**
     * @description: Obtiene la informacion de una placa del cliente
     */
    public getTypePlate(): Observable<any> {
        const params = { method: 'index_all_type_mobile' };
        return this._http.get(this._appSettings.typeMobile.url.base, {
            params,
        });
    }
}
