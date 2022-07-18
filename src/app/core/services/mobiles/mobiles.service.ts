import { Injectable } from '@angular/core';
import { MobileService } from 'app/core/services/mobile.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MobilesInterface } from 'app/core/interfaces/mobiles.interface';
import { items } from 'app/mock-api/apps/file-manager/data';
import { MapFunctionalitieService } from '../maps/map.service';

@Injectable({
  providedIn: 'root'
})
export class MobilesService {

  public subscription: Subscription;
  public items: MobilesInterface[] = [];
  public dataSource: any = [];

  constructor(
    private mobilesService: MobileService,
    public mapFuncionalitieService: MapFunctionalitieService
  ) { }

  getMobiles() {
    this.dataSource = new MatTableDataSource(this.mapFuncionalitieService.mobiles);
    // this.subscription = this.mobilesService.getMobiles().subscribe(({ data }) => {
    //   this.items = data;
    //   this.items.map((x) => {
    //     x['selected'] = false;
    //     return x;
    //   });
    //   this.dataSource = new MatTableDataSource(this.items);
    //   // this.sendDataDevice.emit(this.items);
    // });
  }
}
