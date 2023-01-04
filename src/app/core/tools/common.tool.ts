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

  public deleteItemArray<T = any>(dataArray: T[], itemId: number): T[] {
    const copyDataArray = [...dataArray];
    const index = copyDataArray.findIndex(data => data['id'] === itemId);
    if (index >= 0) {
      copyDataArray.splice(index, 1);
    }
    return [...copyDataArray];
  }

}
