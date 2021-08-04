import { Injectable } from '@angular/core';
import {EndPoints} from './end-points';

@Injectable()
export class AppSettingsService {
    /**
     * @description: Login de usuario
     */
    public auth = {
        url: {
            base: EndPoints.uri('oauth/token'),
        }
    };

}
