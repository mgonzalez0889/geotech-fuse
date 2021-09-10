import {environment} from '../../../environments/environment.prod';


export class EndPoints {
    /**
     * @description: Url base
     */
    static uriBase(url: string): string {
        return environment.baseUrl + url;
    }
    /**
     * @description: Url para los endpoint
     */
    static uri(url: string): string {
        return environment.urlApi + url;
    }

}
