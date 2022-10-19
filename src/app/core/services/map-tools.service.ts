/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import L from 'leaflet';
import moment from 'moment';

@Injectable({
    providedIn: 'root',
})
export class MapToolsService {
    public map: L.Map;
    public markerCluster = L.markerClusterGroup();
    public markers: any = {};
    public mobiles: any[] = [];
    public verLabel: boolean = true;
    public verCluster: boolean = true;
    public pointLatLens: any = [];
    public clusterHistoric: L.MarkerClusterGroup;
    public markersPoint: any = {};

    constructor() {}
    /**
     * @description: Se inicializa el mapa
     */
    public initMap(): void {
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
     * @description: Se crea los marcadores de los vehiculos en el mapa
     */
    public setMarkers(
        mobiles: any,
        verCluster: boolean,
        verLabel: boolean
    ): void {
        mobiles.forEach((value: any, index: number) => {
            const data = mobiles[index];
            this.markers[data.id] = new L.Marker([data.x, data.y], {
                icon: this.setIcon(data),
            });
            // Validamos estado de label
            if (verLabel) {
                this.markers[data.id].bindTooltip(data.plate, {
                    permanent: true,
                    direction: 'bottom',
                    offset: L.point({ x: 0, y: 18 }),
                });
            } else {
                this.markers[data.id].bindTooltip(data.plate, {
                    permanent: false,
                    direction: 'bottom',
                    offset: L.point({ x: 0, y: 18 }),
                });
            }
            // Validamos estado de cluster
            if (verCluster) {
                this.markers[data.id].addTo(this.markerCluster);
                this.markerCluster.addTo(this.map);
            } else {
                this.markers[data.id].addTo(this.map);
            }
            this.pointLatLens.push(
                Object.values(this.markers[data.id].getLatLng())
            );
            this.markers[data.id].options.rotationAngle =
                this.rotationIcon(data);
            // this.markers[data.id].on('click', (e: any) => {
            //     moment.locale('es');
            //     this.getPopup(e, data);
            // });
        });
        this.map.fitBounds(this.pointLatLens);

        // this.map.on('click', (e) => {
        //     if (!this.showMenuMobiles) {
        //         switch (this.type_geo) {
        //             case 'route':
        //                 this.createGeometry(e);
        //                 break;
        //             case 'zone':
        //                 this.createGeometry(e);
        //                 break;
        //             case 'punt':
        //                 let id = 9999999999;
        //                 this.showFormGeomertry = true;
        //                 this.showOptionsGeoTools = false;
        //                 this.showGeoTools = false;
        //                 var latlng = this.map.mouseEventToLatLng(
        //                     e.originalEvent
        //                 );
        //                 this.goDeleteGeometryPath();
        //                 this.map.setView([latlng.lat, latlng.lng]);
        //                 this.markersPoint[id] = L.marker(
        //                     [latlng.lat, latlng.lng],
        //                     {
        //                         icon: L.icon({
        //                             iconUrl: '../assets/icons/iconMap/punt.svg',
        //                             iconSize: [40, 40],
        //                             iconAnchor: [20, 20],
        //                         }),
        //                     }
        //                 );

        //                 this.shape.push(String(latlng.lat + ' ' + latlng.lng));
        //                 this.markersPoint[id].addTo(this.map);
        //                 break;
        //         }
        //     }
        // });
    }
    /**
     * @description: Asigna los iconos para el marcador deacuerdo al estado
     */
    public setIcon(data: any, type?: any, color?: any): any {
        const diffDays = moment(new Date()).diff(
            moment(data.date_entry),
            'days'
        );
        let myIcon: L.Icon<L.IconOptions>;
        if (type === 'historic') {
            return (myIcon = L.icon({
                iconUrl:
                    'data:image/svg+xml,' +
                    encodeURIComponent(
                        '<svg width="16" height="31" viewBox="0 0 16 31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.34146 0.880403C8.28621 0.656155 8.08457 0.498922 7.85362 0.500006C7.62268 0.501089 7.42252 0.660209 7.36938 0.884965L0.513413 29.885C0.457854 30.12 0.578199 30.3611 0.7994 30.458C1.0206 30.5549 1.27944 30.4798 1.41449 30.2796L7.86444 20.7191L14.591 30.2875C14.7293 30.4844 14.9882 30.5547 15.2071 30.4551C15.4261 30.3554 15.543 30.114 15.4855 29.8804L8.34146 0.880403Z" fill="' +
                            color +
                            '" stroke="white" stroke-linejoin="round"/></svg>'
                    ),
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            }));
        } else {
            if (diffDays >= 1 || isNaN(diffDays)) {
                return (myIcon = L.icon({
                    iconUrl: '../assets/icons/iconMap/no_report.svg',
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5],
                }));
            } else {
                if (data.status === 0) {
                    return (myIcon = L.icon({
                        iconUrl: '../assets/icons/iconMap/engine_shutdown.svg',
                        iconSize: [25, 25],
                        iconAnchor: [12.5, 12.5],
                    }));
                } else {
                    if (data.speed === 0) {
                        return (myIcon = L.icon({
                            iconUrl:
                                '../assets/icons/iconMap/engine_ignition.svg',
                            iconSize: [25, 25],
                            iconAnchor: [12.5, 12.5],
                        }));
                    } else {
                        return (myIcon = L.icon({
                            iconUrl: '../assets/icons/iconMap/arrow.svg',
                            iconSize: [36, 36],
                            iconAnchor: [10, 10],
                        }));
                    }
                }
            }
        }
    }
    /**
     * @description: Realiza el cambio de orientacion de los iconos del mapa
     */
    public moveMarker(data: any): void {
        if (this.markers.hasOwnProperty(data.id_mobile)) {
            this.markers[data.id_mobile].slideTo([data.x, data.y], {
                duration: 2000,
                icon: this.setIcon(data),
            });
            this.markers[data.id_mobile].options.rotationAngle =
                this.rotationIcon(data);
            this.markers[data.id_mobile].setIcon(this.setIcon(data));
            this.setData(data);
        }
    }
    /**
     * @description: Mantiene actualizado el array de los vh con la data que llega del socket
     */
    public setData(data: any): void {
        this.mobiles.forEach((x) => {
            if (x.id === data.id_mobile) {
                x.orientation = data.orientation;
                x.speed = data.speed;
                x.x = data.x;
                x.y = data.y;
                x.status = Number(data.status);
                x.status_gps = data.status_gps;
                x.status_signal = data.status_signal;
            }
        });
    }
    /**
     * @description: Eliminar los marcadores en el mapa (Cuando es uno)
     */
    deleteOneChecks(data: any): void {
        console.log(data, 'arturo');
        console.log(this.markers.length,'entro');
        if (this.markers.length) {

            this.map.removeLayer(data);
            this.markerCluster.clearLayers();
        }
    }
    /**
     * @description: Eliminar los marcadores en el mapa (cuando son multiples)
     */
    deleteChecks(data: any, type?: any): void {
        if (type === 'delete') {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                this.map.removeLayer(this.markersPoint[element.id]);
                this.clusterHistoric.clearLayers();
            }
        } else {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                this.map.removeLayer(this.markers[element.id]);
                this.markerCluster.clearLayers();
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
}
