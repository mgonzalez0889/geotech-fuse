import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class SocketIoClientService {
    socket: any;
    readonly url: string = 'http://192.168.140.27:3030';

    constructor() {
        this.socket = io.connect(this.url, {
            secure: true,
            reconnectionDelay: 500,
            reconnection: true,
            forceNew: true,
        });
    }

    /**
     * @description: Envia en mensaje hacia el soket Io
     */
    public sendMessage(mesaage: string): any {
        this.socket.emit(mesaage, {
            token: localStorage.getItem('accessToken'),
        });
    }

    /**
     * @description: Escucha en mensaje que manda el soket Io
     */
    public listenin(mesaage: string): any {
        return new Observable((observer) => {
            this.socket.on(mesaage, (data: any) => {
                observer.next(data);
            });
        });
    }
}
