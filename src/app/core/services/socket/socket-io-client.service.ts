import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketIoClientService {
  socket: any;
  //readonly url: string = 'http://ec2-3-219-47-62.compute-1.amazonaws.com:3030';
  // readonly url: string = '192.168.0.28:3030';
  readonly url: string = '181.57.229.83:3030';

  constructor() {
    this.socket = io.connect(this.url, {
      secure: false,
      reconnectionDelay: 500,
      reconnection: true,
      forceNew: true,
    });
    this.verifyConnections();
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

  private verifyConnections(): void {
    this.socket.on('connect', () => {
      console.log('connect web socket');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnect web socket');
    });

    this.socket.io.on('reconnect', (attempt) => {
      console.log('reconnect', attempt);
    });
  }

}
