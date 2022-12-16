/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AfterViewInit, OnInit } from '@angular/core';
import { MobileService } from 'app/core/services/api/mobile.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { SocketIoClientService } from 'app/core/services/socket/socket-io-client.service';
import { Subject } from 'rxjs';
import { distinct, filter, takeUntil } from 'rxjs/operators';

type OptionsMap = { icon: string; text: string; actionClick: (data: any) => void };

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectPanel: 'history' | 'details' | 'commands' | 'none';
  public selectOption: string = '';
  public optionsMap: OptionsMap[] = [
    {
      icon: 'route-map',
      text: 'map.panelGeotools.routeTitle',
      actionClick: (): void => {
        this.selectOption = 'Rutas';
        this.mapService.selectPanelGeoTools$.next({ titlePanel: 'map.panelGeotools.routeTitle', typePanel: 'routes' });
      },
    },
    {
      icon: 'zone-map',
      text: 'map.panelGeotools.zoneTitle',
      actionClick: (): void => {
        this.selectOption = 'Zonas';
        this.mapService.selectPanelGeoTools$.next({ titlePanel: 'map.panelGeotools.zoneTitle', typePanel: 'zones' });
      },
    },
    {
      text: 'map.panelGeotools.pointControlTitle',
      icon: 'point-map',
      actionClick: (): void => {
        this.selectOption = 'Puntos';
        this.mapService.selectPanelGeoTools$.next({ titlePanel: 'map.panelGeotools.pointControlTitle', typePanel: 'punts' });
      },
    },
    {
      text: 'map.panelGeotools.mapaTitle',
      icon: 'map',
      actionClick: (): void => {
        this.selectOption = 'Mapas';
        this.mapService.selectPanelGeoTools$.next({ titlePanel: 'map.panelGeotools.mapaTitle', typePanel: 'owner_maps' });
      },
    },
  ];

  private mobiles: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public mapService: MapToolsService,
    private socketIoService: SocketIoClientService,
    private mobilesService: MobileService,
  ) { }

  ngOnInit(): void {
    this.listenChanelsSocket();

    this.mapService.selectPanelMap$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ panel }) => {
        this.selectPanel = panel;
      });
  }

  ngOnDestroy(): void {
    this.mobilesService.readyMobiles$.next([]);
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
        zoom: 8,
        attributionControl: false,
        zoomControl: true,
      });
    }, 100);

    this.mobilesService.mobiles$
      .pipe(
        filter(data => !!data.length),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        this.mobiles = [...data || []];
        this.mapService.clearMap();
        this.mapService.setMarkers(data, true);
      });
  }

  /**
   * @description: Filtra por tipo de servicio o dispositivo
   */
  public changeViewCluster(checked: boolean): void {
    this.mapService.verCluster = checked;
    this.mapService.clearMap();
    this.mapService.setMarkers(this.mobiles, true);

  }

  private listenChanelsSocket(): void {
    this.socketIoService.sendMessage('authorization');
    this.socketIoService.listenin('new_position')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        console.log('socket', data);
        this.mapService.mobileSocket$.next(data);
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
