import { Injectable } from '@angular/core';
import {EndPoints} from './end-points';

@Injectable()
export class AppSettingsService {
    /**
     * @description: Login de usuario
     */
    public auth = {
        url: {
            base: EndPoints.uriBase('oauth/token'),
        }
    };
    /**
     * @description: End-point usurious
     */
    public user = {
        url: {
            base: EndPoints.uri('client')
        }
    };
    /**
     * @description: End-point profiles
     */
    public profile = {
        url: {
            base: EndPoints.uri('user_profile')
        }
    };

}
