import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MarkerClusterGroup } from 'leaflet';
import * as L from 'leaflet';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import 'leaflet.markercluster';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
    public markerClusterGroup: L.MarkerClusterGroup;
    public map: L.Map;
    public subscription: Subscription;
    public markers: any = {};
    constructor(
        private mobilesService: MobileService,
        private fleetService: FleetsService
    ) {}

    ngOnInit(): void {
        const time = timer(2000);
        time.subscribe((t) => {
            this.getMobiles();
        });
    }

    /**
     * @description: Obtengo las flotas y vehiculosdel cliente
     */
    private getMobiles(): void {
        this.subscription = this.mobilesService
            .getMobiles()
            .subscribe((data) => {
                this.setmarker(data.data);
            });
        this.subscription = this.fleetService.getFleets().subscribe((data) => {
            console.log(data, ' estos son las flotas');
        });
    }
    /**
     * @description: Genera los marcadores de los moviles en el mapa
     */
    private setmarker(mobiles: any): void {
        const markerCluster = new MarkerClusterGroup();
        mobiles.forEach((value, index) => {
            const data = mobiles[index];
            this.markers[data.id] = new L.Marker([data.x, data.y], {
                icon: this.setIcon(data),
                //rotationAngle: data.orientation,
            }).addTo(markerCluster);
        });
        markerCluster.addTo(this.map);
    }
    /**
     * @description: Asigna los iconos para el marcador deacuerdo al estado
     */
    private setIcon(data: any): any {
        let iconArrow: string = '/assets/icons/arrow-01.svg';
        iconArrow =
            'data:image/svg+xml;utf-8,' +
            encodeURIComponent(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                    '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"\n' +
                    '\t viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve">\n' +
                    '<style type="text/css">\n' +
                    '\t.st0{fill:' +
                    data.color +
                    ';}\n' +
                    '\t.st1{fill:' +
                    data.color +
                    ';}\n' +
                    '</style>\n' +
                    '<g>\n' +
                    '\t<polygon class="st0" points="100,141.1 63.4,153.7 100.4,46 \t"/>\n' +
                    '\t<polygon class="st1" points="100,141.1 136.6,154 100.4,46 \t"/>\n' +
                    '</g>\n' +
                    '</svg>\n '
            );
        let myIcon;
        if (data.engine === 0) {
            return (myIcon = L.icon({
                iconUrl: '/assets/icons/off.svg',
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            }));
        } else {
            if (data.speed === 0) {
                return (myIcon = L.icon({
                    iconUrl: '/assets/icons/on.svg',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                }));
            } else {
                return (myIcon = L.icon({
                    iconUrl: iconArrow,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                }));
            }
        }
    }
    /**
     * @description: Muestra la capa de los mapas
     */

    // eslint-disable-next-line @typescript-eslint/member-ordering
    ngAfterViewInit(): void {
        const time = timer(1000);
        time.subscribe((t) => {
            const googleMaps = L.tileLayer(
                'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
                {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                }
            );
            const googleHybrid = L.tileLayer(
                'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
                {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                }
            );
            this.map = L.map('map', {
                center: [4.658383846282959, -74.09394073486328],
                zoom: 10,
                layers: [googleMaps],
            });

            const baseLayers = {
                googleMaps: googleMaps,
                googleHybrid: googleHybrid,
            };
            L.control.layers(baseLayers).addTo(this.map);
        });
    }
}
