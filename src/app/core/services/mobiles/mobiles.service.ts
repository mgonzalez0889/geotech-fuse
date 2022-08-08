import { Injectable } from '@angular/core';
import { MobileService } from 'app/core/services/mobile.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MobilesInterface } from 'app/core/interfaces/mobiles.interface';
import { items } from 'app/mock-api/apps/file-manager/data';
import { MapFunctionalitieService } from '../maps/map.service';
import { CommandsService } from '../commands.service';

@Injectable({
  providedIn: 'root'
})
export class MobilesService {

  public subscription: Subscription;
  public items: MobilesInterface[] = [];
  public dataSource: any = [];
  detailMobile: any = {};
  lastEvents: any = [];
  time: string;
  status_device: string;
  commandsPlate: any = [];

  constructor(
    private mobilesService: MobileService,
    private commandsService: CommandsService
  ) { }

  async getDetailMobile(id: number) {
    return new Promise((resolve, reject) => {
      this.mobilesService.getDetailMobile(id)
        .subscribe((res: any) => {
          resolve(res);
          this.detailMobile = res.data;
          this.lastEvents = res.last_events;
          this.time = res.time;
          this.status_device = res.status_device;
        }, async (err) => {
          reject(err);
        })
    })
  }

  async getCommandsPlate(data: any) {
    return new Promise((resolve, reject) => {
      this.commandsService.getCommandsPlate(data)
        .subscribe((res: any) => {
          resolve(res);
          if (res.code != 400) {
            this.commandsPlate = res.data;
          } else {
            this.commandsPlate = [];
          }
        }, async (err) => {
          reject(err);
        })
    })
  }
}
