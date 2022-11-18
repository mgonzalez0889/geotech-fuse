/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { SocketIoClientService } from 'app/core/services/socket-io-client.service';
import { MobileService } from 'app/core/services/mobile.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {

  private googleMaps = L.tileLayer(
    'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }
  );

  constructor(
    public mapService: MapToolsService,
    private socketIoService: SocketIoClientService,
    private mobilesService: MobileService
  ) { }

  ngOnInit(): void {
    this.listenChanelsSocket();
  }

  ngAfterViewInit(): void {
    this.mapService.initMap({
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topright',
      },
      center: [11.004313, -74.808137],
      zoom: 11,
      layers: [this.googleMaps],
      attributionControl: false,
      zoomControl: true,
    });
    this.mapService.getLocation();
    this.mobilesService.mobiles$.subscribe((data) => {

      this.mapService.setMarkers(
        data,
        this.mapService.verCluster,
        this.mapService.verLabel
      );
      console.log(data);

    });
  }

  private listenChanelsSocket(): void {
    this.socketIoService.sendMessage('authorization');
    this.socketIoService.listenin('new_position')
      .subscribe((data: any) => {
        console.log('socket chanel', data);

        this.mapService.moveMarker(data);
      });

    this.socketIoService
      .listenin('new_command')
      .subscribe((data: any) => {

        console.log('command ', data);
      });

  }

}
