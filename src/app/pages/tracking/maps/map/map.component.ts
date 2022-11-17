/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import * as L from 'leaflet';
import { MapToolsService } from 'app/core/services/map-tools.service';

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
    private mapService: MapToolsService
  ) { }

  ngOnInit(): void {

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
  }

}
