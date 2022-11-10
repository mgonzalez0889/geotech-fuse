import { Injectable } from '@angular/core';
import { MapService } from '../map.service';
import { MapFunctionalitieService } from '../maps/map.service';
import { HistoriesService } from '../api/histories.service';

@Injectable({
  providedIn: 'root',
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
      this.mapService.getGeometry(type).subscribe(
        (res: any) => {
          resolve(res);
          if (res.code != 400) {
            this.mapFunctionalitieService.geometrys = res.data.map(
              function (x) {
                x['selected'] = false;
                x['color'] = getRandomColor();
                return x;
              }
            );
          } else {
            this.mapFunctionalitieService.geometrys = [];
          }
        },
        async (err) => {
          reject(err);
        }
      );
    });
  }

  async getHistoric(data: any) {
    console.log(data, 'daataaa');

    return new Promise((resolve, reject) => {
      this._historicService.getHistories(data).subscribe(
        (res: any) => {
          if (
            this.mapFunctionalitieService.type_historic ===
            'historic'
          ) {
            resolve(res);
            this.mapFunctionalitieService.historic = [];
            let historic = res;

            for (
              let i = 0;
              i <
              this.mapFunctionalitieService.plateHistoric.length;
              i++
            ) {
              const element =
                this.mapFunctionalitieService.plateHistoric[i];

              let encontrado = historic.plates.filter((x) => {
                return x.plate == element;
              });

              let data = [];
              if (encontrado.length > 0) {
                data = historic.data.filter((x) => {
                  return x.plate == element;
                });

                this.mapFunctionalitieService.historic.push({
                  plate: element,
                  color: getRandomColor(),
                  data: data,
                  selected: false,
                });
              } else {
                this.mapFunctionalitieService.historic.push({
                  plate: element,
                  data: data,
                });
              }
            }

            for (
              let j = 0;
              j < this.mapFunctionalitieService.historic.length;
              j++
            ) {
              this.mapFunctionalitieService.historic[j].data.map(
                (x) => {
                  return (x['selected'] = false);
                }
              );
            }
          } else {
            resolve(res.data);
          }
        },
        async (err) => {
          reject(err);
        }
      );
    });
  }

  async getHistoricTrip(data: any) {
    return new Promise((resolve, reject) => {
      this._historicService.getHistoriesTrip(data).subscribe(
        (res: any) => {
          resolve(res);
          this.mapFunctionalitieService.historicTrip = [];
          let historicTrip = res;

          for (
            let i = 0;
            i < this.mapFunctionalitieService.plateHistoric.length;
            i++
          ) {
            const element =
              this.mapFunctionalitieService.plateHistoric[i];

            let encontrado = historicTrip.plates.filter((x) => {
              return x.plate == element;
            });

            let data = [];
            let trip = [];
            if (encontrado.length > 0) {
              data = historicTrip.data.filter((x) => {
                return x.plate == element;
              });

              trip = historicTrip.trips.filter((x) => {
                return x.plate == element;
              });

              let trips = [];
              for (let j = 0; j < trip.length; j++) {
                const element = trip[j];
                trips.push({
                  ...element,
                  item: j + 1,
                  color: getRandomColor(),
                });
              }

              this.mapFunctionalitieService.historicTrip.push({
                plate: element,
                color: getRandomColor(),
                ...data[0],
                trips: trips,
                selected: false,
                tiene_data: true,
              });
            } else {
              this.mapFunctionalitieService.historicTrip.push({
                plate: element,
                tiene_data: false,
              });
            }
          }
        },
        async (err) => {
          reject(err);
        }
      );
    });
  }

  async saveGeometry(type: string, data: any) {
    return new Promise((resolve, reject) => {
      this.mapService.postGeometry(type, data).subscribe(
        (res: any) => {
          resolve(res.code);
        },
        async (err) => {
          reject(err);
        }
      );
    });
  }
}

function getRandomColor(): any {
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}
