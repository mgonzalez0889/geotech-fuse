import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonTools {

  public getRandomColor(): string {
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 10);
    }
    return color;
  }

}
