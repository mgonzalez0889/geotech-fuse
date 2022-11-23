/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy } from '@angular/core';
import { AfterViewInit, OnInit } from '@angular/core';
import { MobileService } from 'app/core/services/mobile.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { SocketIoClientService } from 'app/core/services/socket-io-client.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  public dataSocket: any = null;
  private mobiles: any[] = [];
  private unsubscribe$ = new Subject<void>();
  constructor(
    public mapService: MapToolsService,
    private socketIoService: SocketIoClientService,
    private mobilesService: MobileService
  ) { }

  ngOnInit(): void {
    this.listenChanelsSocket();
  }

  ngOnDestroy(): void {
    this.mapService.clearMap();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.mapService.initMap({
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: 'topright',
        },
        center: [11.004313, -74.808137],
        zoom: 10,
        attributionControl: false,
        zoomControl: true,
      });
    }, 500);


    this.mobilesService.mobiles$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.mobiles = [...data || []];

        this.mapService.setMarkers(data, true);
      });
  }

  /**
   * @description: Filtra por tipo de servicio o dispositivo
   */
  public changeViewCluster(checked: boolean): void {
    this.mapService.verCluster = checked;
    this.mapService.clearMap();
    this.mapService.setMarkers(this.mobiles);
  }

  /**
   * @description: Filtra por tipo de servicio o dispositivo
   */
  public changeViewLabel(checked: boolean): void {
    this.mapService.verLabel = checked;
    this.mapService.clearMap();
    this.mapService.setMarkers(this.mobiles);
  }

  private listenChanelsSocket(): void {
    this.socketIoService.sendMessage('authorization');
    this.socketIoService.listenin('new_position')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        console.log('new_position ', data);
        this.dataSocket = { ...data };
        this.mapService.moveMarker(data);
      });

    this.socketIoService
      .listenin('new_command')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {

        console.log('command ', data);
      });
  }


}
