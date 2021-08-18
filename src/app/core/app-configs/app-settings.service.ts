import { Injectable } from '@angular/core';
import { EndPoints } from './end-points';

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
    /**
     * @description: End-point menu-option
     */
    public menuOptions = {
        url: {
            base: EndPoints.uri('option')
        }
    };
    /**
     * @description: End-point contact
     */
    public contact = {
        url: {
            base: EndPoints.uri('contact')
        }
    };
    /**
     * @description: End-point User Profile Options
     */
    public userProfileOption = {
        url: {
            base: EndPoints.uri('user_profile_option')
        }
    };
    /**
     * @description: End-point Owners
     */
    public owners = {
        url: {
            base: EndPoints.uri('owner')
        }
    };
    /**
     * @description: End-point projects
     */
    public projects = {
        url: {
            base: EndPoints.uri('project')
        }
    };

}
