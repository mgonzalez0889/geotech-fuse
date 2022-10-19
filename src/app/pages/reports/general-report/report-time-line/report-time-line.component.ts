/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import * as L from 'leaflet';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoriesService } from 'app/core/services/histories.service';

@Component({
    selector: 'app-report-time-line',
    templateUrl: './report-time-line.component.html',
    styleUrls: ['./report-time-line.component.scss'],
})
export class ReportTimeLineComponent implements OnInit, AfterViewInit {
    public map: L.Map;
    public markerGroup = L.markerClusterGroup();
    public dataPayload: any;
    public markers: any[] = [];
    public pointMap = [];

    constructor(
        private activatedRouter: ActivatedRoute,
        private _historicService: HistoriesService
    ) {}

    ngOnInit(): void {
        this.readAndParseData();
    }

    ngAfterViewInit(): void {
        this.loadMap();
    }

    /**
     * @description: se parsea la data de la query y se hace la peticion
     */
    private readAndParseData(): void {
        this.activatedRouter.queryParams.subscribe(
            ({ events, fleets, plates, limit, page, ...dataQuery }) => {
                const eventsArray = this.convertStringToArray(
                    events,
                    'events'
                ) as number[];

                const fleetsArray = this.convertStringToArray(
                    fleets,
                    'fleets'
                ) as number[];

                const platesArray = this.convertStringToArray(
                    plates,
                    'plates'
                ) as string[];

                this._historicService
                    .getHistories({
                        events: eventsArray,
                        plates: platesArray,
                        fleets: fleetsArray,
                        limit: Number(limit),
                        page: Number(page),
                        ...dataQuery,
                    })
                    .subscribe(({ data }) => {
                        this.dataPayload = data;
                        this.setMarkers(this.dataPayload, false);
                    });
            }
        );
    }

    /**
     * @description: parsea los string que vienen por query a array
     */
    private convertStringToArray(
        value: string,
        keyValid: string
    ): number[] | string[] {
        return keyValid === 'plates'
            ? value.split(',')
            : value.split(',').map((valueArray: string) => Number(valueArray));
    }

    /**
     * @description: se carga y se genera el mapa
     */
    private loadMap(): void {
        const GoogleMaps = L.tileLayer(
            'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
            {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            }
        );
        const GoogleHybrid = L.tileLayer(
            'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
            {
                maxZoom: 20,
                subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            }
        );
        this.map = L.map('map', {
            fullscreenControl: true,
            center: [11.004313, -74.808137],
            zoom: 10,
            layers: [GoogleMaps],
            attributionControl: false,
        });
        const baseLayers = {
            'Google Maps': GoogleMaps,
            'Google Hibrido': GoogleHybrid,
        };
        L.control.layers(baseLayers).addTo(this.map);
    }

    /**
     * @description:Setea los marcadores
     */
    private setMarkers(reports: any[], valClouster: boolean): void {
        reports.forEach((data, index) => {
            this.markers[data.id] = new L.Marker([data.x, data.y], {
                icon: this.iconMap(data),
                rotationAngle: this.rotationIcon(data),
            });
            if (valClouster) {
                this.markers[data.id].addTo(this.markerGroup);
                this.markerGroup.addTo(this.map);
            } else {
                this.markers[data.id].addTo(this.map);
            }
            this.pointMap.push(
                Object.values(this.markers[data.id].getLatLng())
            );
            this.markers[data.id].previousLatLngs = [];
        });

        const bounds = new L.LatLngBounds(this.pointMap);
        this.map.fitBounds(bounds);
    }

    /**
     * @description:Setea los iconos
     */
    private iconMap(report: any): any {
        const arrow =
            'data:image/svg+xml,' +
            encodeURIComponent(
                '<svg width="48" height="54" viewBox="0 0 48 54" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_1135_23154)"><path d="M23.9211 6.70219L41.7476 47.2387L23.7281 34.1518L6 44.4789L23.9211 6.70219Z" fill="' +
                    report.color +
                    '"/><path d="M8.28817 41.9887L23.8866 9.10794L39.344 44.2571L24.3157 33.3427L23.7881 32.9595L23.2247 33.2877L8.28817 41.9887Z" stroke="white" stroke-width="2"/></g><defs><filter id="filter0_d_1135_23154" x="0" y="0.702148" width="47.748" height="52.5366" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.56 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1135_23154"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1135_23154" result="shape"/></filter></defs></svg>'
            );
        const circleIcon =
            'data:image/svg+xml,' +
            encodeURIComponent(
                '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="url(#paint0_radial_43_4)" fill-opacity="0.67"/><path d="M18 32.5C26.0081 32.5 32.5 26.0081 32.5 18C32.5 9.99187 26.0081 3.5 18 3.5C9.99187 3.5 3.5 9.99187 3.5 18C3.5 26.0081 9.99187 32.5 18 32.5Z" fill="' +
                    report.color +
                    '" stroke="white"/><defs><radialGradient id="paint0_radial_43_4" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 18) rotate(90) scale(18)"><stop offset="0.802083" stop-color="#3D3D3D" stop-opacity="0.51"/><stop offset="0.895833" stop-color="#1D1D1D" stop-opacity="0.56"/><stop offset="1" stop-color="#8A8A8A" stop-opacity="0.57"/></radialGradient></defs></svg>'
            );
        let myIcon;
        switch (report.event_id) {
            case 6:
                return (myIcon = L.icon({
                    iconUrl:
                        '../../../../../assets/images/svg/engine_shutdown.svg',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                }));
            case 5:
                return (myIcon = L.icon({
                    iconUrl:
                        '../../../../../assets/images/svg/engine_ignition.svg',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                }));
            case 273:
                return (myIcon = L.icon({
                    iconUrl:
                        '../../../../../assets/images/svg/geobolt_close.svg',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                }));
            case 274:
                return (myIcon = L.icon({
                    iconUrl:
                        '../../../../../assets/images/svg/geobolt_open.svg',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                }));
            default:
                if (report.speed > 0) {
                    return (myIcon = L.icon({
                        iconUrl: arrow,
                        iconSize: [36, 36],
                        iconAnchor: [18, 18],
                    }));
                } else {
                    return (myIcon = L.icon({
                        iconUrl: circleIcon,
                        iconSize: [22, 22],
                        iconAnchor: [11, 11],
                    }));
                }
        }
    }

    /**
     * @description:Setea la rotacion
     */
    private rotationIcon(report: any): any {
        let rotaIcon;
        if (
            +report.event_id === 6 ||
            +report.event_id === 273 ||
            +report.event_id === 274 ||
            (+report.event_id === 5 && +report.speed === 0)
        ) {
            return (rotaIcon = null);
        } else {
            return (rotaIcon = report.orientation);
        }
    }
}
