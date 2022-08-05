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
        },
    };
    /**
     * @description: End-point usurious
     */
    public user = {
        url: {
            base: EndPoints.uri('client'),
        },
    };
    /**
     * @description: End-point profiles
     */
    public profile = {
        url: {
            base: EndPoints.uri('user_profile'),
            profilePlate: EndPoints.uri('user_profile_plate'),
        },
    };
    /**
     * @description: End-point menu-option
     */
    public menuOptions = {
        url: {
            base: EndPoints.uri('option'),
            optionsFather: EndPoints.uri('user_profile_option'),
        },
    };
    /**
     * @description: End-point contact
     */
    public contact = {
        url: {
            base: EndPoints.uri('contact'),
        },
    };
    /**
     * @description: End-point User Profile Options
     */
    public userProfileOption = {
        url: {
            base: EndPoints.uri('user_profile_option'),
        },
    };
    /**
     * @description: End-point Owners
     */
    public owners = {
        url: {
            base: EndPoints.uri('owner'),
        },
    };
    /**
     * @description: End-point projects
     */
    public projects = {
        url: {
            base: EndPoints.uri('project'),
        },
    };
    /**
     * @description: End-point fleets
     */
    public fleets = {
        url: {
            base: EndPoints.uri('fleet'),
            fleePlate: EndPoints.uri('fleet_plate'),
        },
    };
    /**
     * @description: End-point mobiles
     */
    public mobile = {
        url: {
            base: EndPoints.uri('mobile'),
        },
    };
    /**
     * @description: End-point owner plates
     */
    public ownerPlate = {
        url: {
            base: EndPoints.uri('owner_plate'),
        },
    };
    /**
     * @description: End-point events
     */
    public events = {
        url: {
            base: EndPoints.uri('owner_event'),
        },
    };
    /**
     *@description: End-point histories
     */
    public histories = {
        url: {
            base: EndPoints.uri('historic'),
        },
    };
    /**
     *@description: End-point commands
     */
    public commands = {
        url: {
            base: EndPoints.uri('command'),
        },
    };
    /**
     *@description: End-point geo zonas
     */
    public owner_zone = {
        url: {
            base: EndPoints.uri('owner_zone'),
        },
    };
    /**
     *@description: End-point Centro de control
     */
    public controlCenter = {
        url: {
            base: EndPoints.uri('alarm'),
        },
    };
    /**
     *@description: End-point contactos de Centro de control
     */
    public contactsControlCenter = {
        url: {
            base: EndPoints.uri('control_center_contact'),
        },
    };
    /**
     *@description: End-point tipos de contactos Centro de control
     */
    public typeContactsControlCenter = {
        url: {
            base: EndPoints.uri('type_contact'),
        },
    };

    /**
     *@description: End-point geo zonas
     */
    public show_mobile = {
        url: {
            base: EndPoints.uri('show_mobile'),
        },
    };
    /**
     * @description: End-point despachos
     */
    public dispath = {
        url: {
            base: EndPoints.uri('dispath'),
        },
    };
}
