import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MarkerClusterGroup } from 'leaflet';
import * as L from 'leaflet';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import moment from 'moment';
import { SocketIoClientService } from '../../../../core/services/socket-io-client.service';
import DriftMarker from 'leaflet-drift-marker';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit, AfterViewInit {
    public showMenuMobiles: boolean = true;
    public showDetailMobile: boolean = false;
    public showHistory: boolean = false;
    public showMenuFleet: boolean = false;
    public markerClusterGroup: L.MarkerClusterGroup;
    public map: L.Map;
    public subscription: Subscription;
    public markers: any = {};
    public mobiles: any = [];
    constructor(
        private mobilesService: MobileService,
        private fleetService: FleetsService,
        private socketIoService: SocketIoClientService
    ) {}

    ngOnInit(): void {
        //abre el socket y manda el token del usuario
        this.socketIoService.sendMessage('authorization');
        //escucha el socket de new position
        this.socketIoService.listenin('new_position').subscribe((data: any) => {
            this.moveMarker(data);
        });
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
                this.mobiles = data.data;
                console.log('carros', this.mobiles);
                this.setmarker(this.mobiles);
            });
        this.subscription = this.fleetService.getFleets().subscribe((data) => {
            console.log(data, ' estos son las flotas');
        });
    }
    private moveMarker(data: any): void {
        console.log(data, 'data importer');
        const marker = new DriftMarker([10, 10]);
        marker.slideTo([20, 20], {
            duration: 2000,
            keepAtCenter: true,
          });
    }

    /**
     * @description: Genera los marcadores de los moviles en el mapa
     */
    private setmarker(mobiles: any): void {
        const markerCluster = new MarkerClusterGroup();
        const infoWindows = `<table>
        <tr>
            <th rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">
            </th>
            <th>GB001</th>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">

            </td>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">

            </td>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">

            </td>
            <td rowspan="2">
                <img src="./assets/icons/iconMap/geobolt_close.svg">
            </td>
        </tr>
        <tr>
            <td>4444</td>
        </tr>
        <tr>
            <th colspan="3"> ultimo reporte</th>
            <th colspan="3">Velocidad</td>
        </tr>
        <tr>
            <td colspan="3"> hace 40 min</td>
            <td colspan="3">45 Km/H</td>
        </tr>
        <tr>
            <th colspan="6">Ultima posicion</th>
        </tr>
        <tr>
            <td colspan="6">Cra 55 # 100 - 51 Barranquilla, Atlantico</td>
        </tr>
        <tr>
            <th colspan="6">Frencuencia actual</th>
        </tr>
           </table>`;
        const popup = L.popup();
        mobiles.forEach((value: any, index: string | number) => {
            const data = mobiles[index];
            this.markers[data.id] = new L.Marker([data.x, data.y], {
                icon: this.setIcon(data),
                rotationAngle: this.rotationIcon(data),
            })
                .bindTooltip(data.plate, {
                    permanent: true,
                    direction: 'bottom',
                    offset: L.point({ x: 2, y: 10 }),
                })
                .addTo(markerCluster);
            this.markers[data.id]
                .bindPopup(infoWindows, {
                    closeOnClick: false,
                    autoClose: false,
                    closeButton: true,
                })
                .openPopup();
            markerCluster.addTo(this.map);
        });
    }
    /**
     * @description: Asigna los iconos para el marcador deacuerdo al estado
     */
    private setIcon(data: any): any {
        const diffDays = moment(new Date()).diff(
            moment(data.date_entry),
            'days'
        );
        let myIcon: L.Icon<L.IconOptions>;
        if (diffDays >= 1 || isNaN(diffDays)) {
            return (myIcon = L.icon({
                iconUrl: '../assets/icons/iconMap/no_report.svg',
                iconSize: [25, 25],
                iconAnchor: [12.5, 12.5],
            }));
        } else {
            if (data.engine === 0) {
                return (myIcon = L.icon({
                    iconUrl: '../assets/icons/iconMap/engine_shutdown.svg',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                }));
            } else {
                if (data.speed === 0) {
                    return (myIcon = L.icon({
                        iconUrl: '../assets/icons/iconMap/engine_ignition.svg',
                        iconSize: [25, 25],
                        iconAnchor: [12.5, 12.5],
                    }));
                } else {
                    return (myIcon = L.icon({
                        iconUrl: '../assets/icons/iconMap/arrow.svg',
                        iconSize: [36, 36],
                        iconAnchor: [18, 18],
                    }));
                }
            }
        }
    }
    /**
     * @description: Asigna la rotacion de los iconos
     */
    private rotationIcon(data: any): any {
        const diffDays = moment(new Date()).diff(
            moment(data.date_entry),
            'days'
        );
        let rotaIcon: any;
        if (diffDays >= 1 || isNaN(diffDays)) {
            return (rotaIcon = null);
        } else {
            return (rotaIcon = data.orientation);
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
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Google Maps': googleMaps,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Google Hibrido': googleHybrid,
            };
            L.control.layers(baseLayers).addTo(this.map);
        });
    }
}
