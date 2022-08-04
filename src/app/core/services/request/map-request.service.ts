import { Injectable } from '@angular/core';
import { MapService } from '../map.service';
import { MatTableDataSource } from '@angular/material/table';
import { MapFunctionalitieService } from '../maps/map.service';
import { HistoriesService } from '../histories.service';

@Injectable({
  providedIn: 'root'
})
export class MapRequestService {

  public dataSource: any = [];

  constructor(
    private mapService: MapService,
    public mapFunctionalitieService: MapFunctionalitieService,
    private _historicService: HistoriesService
  ) { }

  async getGeometry(type: string) {
    return new Promise((resolve, reject) => {
      this.mapService.getGeometry(type)
        .subscribe((res: any) => {
          resolve(res);
          if (res.code != 400) {
            this.mapFunctionalitieService.geometrys = res.data.map(function (x) {
              x["selected"] = false;
              x["color"] = getRandomColor();
              return x;
            });
          } else {
            this.mapFunctionalitieService.geometrys = [];
          }
        }, async (err) => {
          reject(err);
        })
    })
  }

  async getHistoric(data: any) {
    return new Promise((resolve, reject) => {
      this._historicService.getHistories(data)
        .subscribe((res: any) => {
          resolve(res);
          this.mapFunctionalitieService.historic = [];
          let historic = res;

          for (let i = 0; i < this.mapFunctionalitieService.plateHistoric.length; i++) {
            const element = this.mapFunctionalitieService.plateHistoric[i];

            let encontrado = historic.plates.filter(x => {
              return x.plate == element;
            })

            let data = [];
            if (encontrado.length > 0) {
              data = historic.data.filter(x => {
                return x.plate == element;
              });

              this.mapFunctionalitieService.historic.push({
                plate: element,
                color: getRandomColor(),
                data: data
              })
            } else {
              this.mapFunctionalitieService.historic.push({
                plate: element,
                data: data
              })
            }
          }

          for (let j = 0; j < this.mapFunctionalitieService.historic.length; j++) {
            this.mapFunctionalitieService.historic[j].data.map(x => {
              return x["selected"] = false;
            })
          }

        }, async (err) => {
          reject(err);
        })
    })
  }

  async saveGeometry(type: string, data: any) {
    return new Promise((resolve, reject) => {
      this.mapService.postGeometry(type, data)
        .subscribe((res: any) => {
          resolve(res.code);
        }, async (err) => {
          reject(err);
        })
    })
  }
}

function getRandomColor(): any {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}