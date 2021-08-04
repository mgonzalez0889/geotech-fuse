import {environment} from "../../../environments/environment.prod";


export class EndPoints {

    static uri(url: string): string {
        return environment.baseUrl + url;
    }

}
