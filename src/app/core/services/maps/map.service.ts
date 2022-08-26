import {
    Injectable,
    ComponentFactoryResolver,
    Injector,
    ApplicationRef,
} from '@angular/core';
import moment from 'moment';
import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-rotatedmarker';
import { timer } from 'rxjs';
import 'leaflet.marker.slideto';
import { InfoWindowsComponent } from 'app/pages/tracking/osm-maps/info-windows/info-windows.component';
import { MobilesService } from '../mobiles/mobiles.service';
import { MatTableDataSource } from '@angular/material/table';
import { functions } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class MapFunctionalitieService {
    public pointLatLens: any = [];
    public mobiles: any[] = [];
    public mobile_set: any[] = [];
    public geometrys: any[] = [];
    public dataSource: any = [];
    public fleets: any[] = [];
    public dataSourceFleets: any = [];
    public commandsPlate: any = [];
    public markers: any = {};
    public map: L.Map;
    public markerCluster = new MarkerClusterGroup();
    public type_service: any = [];

    // Mostrar y ocultar componentes de mapa (Menu mobiles, geotools, historico, comandos)
    public showMenuMobiles: boolean = true;
    public showDetailMobile: boolean = false;
    public showGeoTools: boolean = false;
    public showOptionsGeoTools: boolean = false;
    public showFormGeomertry: boolean = false;
    public showHistoricPlate: boolean = false;
    public showCommandsPlate: boolean = false;
    public verLabel: boolean = true;
    public verCluster: boolean = true;

    drawerMode = 'side';
    drawerOpened = false;

    popup = L.popup({
        closeButton: false,
        keepInView: true,
        maxWidth: 300,
    });
    compRef: any;
    placeInfoWindow: any;
    counter: any;
    dataInfoWindows: any;
    type_geometry: string;
    type_geo: string = '';
    punts_geometry: any = [];
    paint_punts: any = [];
    coordinates = [];
    markersPoint = {};
    shape: any = [];
    new_point: string;
    punt_geometry: any = [];
    locationService: any;
    latitud: null;
    longitud: null;
    plateHistoric = [];
    events = [];

    count: number = 0;
    selectedTypeService;
    historic: any = [];
    historicTrip: any = [];
    platesFleet: any = [];
    plate: any;

    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    googleMaps = L.tileLayer(
        'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
    );
    googleHybrid = L.tileLayer(
        'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
        {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
    );

    // streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

    changeMapa = this.googleMaps;

    baseLayers = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Google Maps': this.googleMaps,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Google Hibrido': this.googleHybrid,
    };
    clusterHistoric: L.MarkerClusterGroup;
    layerControl: L.Control.Layers;

    constructor(
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef,
        public mobileRequestService: MobilesService
    ) {}

    drawerOpenedChanged(): void {
        this.drawerOpened = !this.drawerOpened;
    }

    visibleGeo() {
        this.drawerOpenedChanged();
        this.showMenuMobiles = !this.showMenuMobiles;
        this.showOptionsGeoTools = !this.showOptionsGeoTools;

        if (!this.showOptionsGeoTools) {
            this.setMarkers(this.mobiles, this.verCluster, this.verLabel);
        } else {
            this.deleteChecks(this.mobiles);
        }
    }

    async init() {
        const time = timer(1000);
        time.subscribe((t) => {
            this.map = L.map('map', {
                center: [4.658383846282959, -74.09394073486328],
                zoom: 10,
                layers: [this.googleMaps],
                attributionControl: false,
                zoomControl: false,
            });

            this.layerControl = L.control.layers(this.baseLayers).addTo(this.map);

            // L.control.zoom({
            //   position: 'topright'
            // }).addTo(this.map);
        });
    }

    convertDateHour(date) {
        moment.locale('es');
        return moment(date).fromNow();
    }

    changeMap(newMap) {
        console.log(newMap);
        this.baseLayers['Google Maps'].addTo(this.map);
        console.log(this.baseLayers);
        // let map = {
        //     newMap
        // }
        // if (newMap === 'google') {

        // } else {
        //     this.changeMapa = this.googleHybrid;
        // }
    }

    changeMapHybrid(newMap) {
        this.baseLayers['Google Hibrido'].addTo(this.map);
        // let map = {
        //     newMap
        // }
        // if (newMap === 'google') {

        // } else {
        //     this.changeMapa = this.googleHybrid;
        // }
    }

    loadAllsMobiles() {
        this.deleteChecks(this.mobiles);
        this.setMarkers(this.mobiles, this.verCluster, this.verLabel);
    }

    receiveData(type: string, data: any) {
        if (type === 'checked') {
            if (data.length) {
                this.deleteChecks(this.mobiles);
                this.setMarkers(data, this.verCluster, this.verLabel);
            } else {
                this.loadAllsMobiles();
            }
        } else {
            this.loadAllsMobiles();
        }
    }

    deleteChecks(data: any, type?) {
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

    moveMarker(data) {
        // const marker = new DriftMarker([10, 10]);
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

    setData(data: any) {
        this.mobiles.forEach((x) => {
            if (x.id == data.id_mobile) {
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

    setMarkers(mobiles: any, verCluster, verLabel): any {
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
            this.markers[data.id].on('click', (e: any) => {
                moment.locale('es');
                this.getPopup(e, data);
            });
        });

        this.map.fitBounds(this.pointLatLens);

        this.map.on('click', (e) => {
            if (!this.showMenuMobiles) {
                switch (this.type_geo) {
                    case 'route':
                        this.createGeometry(e);
                        break;
                    case 'zone':
                        this.createGeometry(e);
                        break;
                    case 'punt':
                        let id = 9999999999;
                        this.showFormGeomertry = true;
                        this.showOptionsGeoTools = false;
                        this.showGeoTools = false;
                        var latlng = this.map.mouseEventToLatLng(
                            e.originalEvent
                        );
                        // if (this.markersPoint[id] != undefined) {
                        //   this.map.removeLayer(this.markersPoint[id]);
                        // }
                        this.goDeleteGeometryPath();
                        this.map.setView([latlng.lat, latlng.lng]);
                        this.markersPoint[id] = L.marker(
                            [latlng.lat, latlng.lng],
                            {
                                icon: L.icon({
                                    iconUrl: '../assets/icons/iconMap/punt.svg',
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 20],
                                }),
                            }
                        );

                        this.shape.push(String(latlng.lat + ' ' + latlng.lng));
                        this.markersPoint[id].addTo(this.map);
                        break;
                }
            }
        });
    }

    createPuntControlCenter(data: any): void {
        console.log(data.color_event, 'wwww');
        let x;
        let y;
        const myIconUrl =
            'data:image/svg+xml,' +
            encodeURIComponent(
                '<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19C5.73693 17.9227 4.56619 16.7416 3.5 15.4691C1.9 13.5581 8.83662e-07 10.712 8.83662e-07 8.00005C-0.00141728 5.1676 1.70425 2.61344 4.32107 1.52945C6.93789 0.445455 9.95007 1.04529 11.952 3.04905C13.2685 4.35966 14.0059 6.14244 14 8.00005C14 10.712 12.1 13.5581 10.5 15.4691C9.43382 16.7416 8.26307 17.9227 7 19ZM7 5.00005C5.92821 5.00005 4.93782 5.57185 4.40193 6.50005C3.86603 7.42825 3.86603 8.57185 4.40193 9.50005C4.93782 10.4283 5.92821 11.0001 7 11.0001C8.65686 11.0001 10 9.6569 10 8.00005C10 6.3432 8.65686 5.00005 7 5.00005Z" fill="' +
                    data.color_event +
                    '"/></svg>'
            );
        x = data.x;
        y = data.y;
        this.map.setView([x, y]);
        this.markersPoint[data.id] = L.marker([x, y], {
            icon: L.icon({
                iconUrl: myIconUrl,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            }),
        });
        this.markersPoint[data.id].addTo(this.map);
    }

    createPunt(data: any, historic?, color?) {
        let shape;
        switch (this.type_geo) {
            case 'route':
                shape = JSON.parse(data.shape);
                for (let i = 0; i < shape.length; i++) {
                    const element = shape[i];
                    let x = element.split(' ')[0];
                    let y = element.split(' ')[1];
                    this.paint_punts.push({
                        lat: x,
                        lng: y,
                    });
                }
                this.map.setView(
                    [this.paint_punts[0].lat, this.paint_punts[0].lng],
                    5
                );

                this.punt_geometry[data.id] = L.polyline(this.paint_punts, {
                    color: data.color,
                    weight: 6,
                });

                this.punt_geometry[data.id].addTo(this.map);
                break;
            case 'historic':
                this.paint_punts = [];
                this.clusterHistoric = L.markerClusterGroup({
                    iconCreateFunction: function (cluster) {
                        var marker = cluster.getAllChildMarkers();
                        var html =
                            '<div class="svg-icon abstract-tracker-marker" title="" style="transform: rotate(' +
                            marker[marker.length - 1].options.rotationAngle +
                            'deg) scale(1); transform-origin: center center;">          <img src="' +
                            marker[marker.length - 1].options.icon.options
                                .iconUrl +
                            '"></div>';
                        return L.divIcon({
                            html: html,
                            className: '',
                            iconSize: L.point(32, 32),
                        });
                    },
                });
                for (let i = 0; i < historic.length; i++) {
                    const element = historic[i];
                    let x = element.x;
                    let y = element.y;
                    this.paint_punts.push({
                        lat: x,
                        lng: y,
                    });

                    this.markersPoint[historic[i].id] = L.marker([x, y], {
                        icon: this.setIcon(historic[i], 'historic', historic[i].color),
                    }).addTo(this.clusterHistoric);
                    // this.markerCluster.addTo(clusterHistoric);
                    this.clusterHistoric.addTo(this.map);

                    this.markersPoint[historic[i].id].on('click', (e: any) => {
                        moment.locale('es');
                        this.getPopup(e, historic[i]);
                    });

                    this.markersPoint[historic[i].id].options.rotationAngle =
                        this.rotationIconHistoric(historic[i]);
                }
                this.map.setView(
                    [this.paint_punts[0].lat, this.paint_punts[0].lng],
                    12
                );

                this.punt_geometry[historic[0].id] = L.polyline(
                    this.paint_punts,
                    {
                        color: color,
                        weight: 6,
                    }
                );

                this.punt_geometry[historic[0].id].addTo(this.map);
                break;
            case 'zone':
                shape = JSON.parse(data.shape);
                for (let i = 0; i < shape.length; i++) {
                    const element = shape[i];
                    let x = element.split(' ')[0];
                    let y = element.split(' ')[1];
                    this.paint_punts.push({
                        lat: x,
                        lng: y,
                    });
                }
                this.map.setView(
                    [this.paint_punts[0].lat, this.paint_punts[0].lng],
                    10
                );

                this.punt_geometry[data.id] = L.polygon(this.paint_punts, {
                    color: data.color,
                    weight: 6,
                });

                this.punt_geometry[data.id].addTo(this.map);
                break;
            case 'punt':
                let myIconUrl =
                    'data:image/svg+xml,' +
                    encodeURIComponent(
                        '<svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19C5.73693 17.9227 4.56619 16.7416 3.5 15.4691C1.9 13.5581 8.83662e-07 10.712 8.83662e-07 8.00005C-0.00141728 5.1676 1.70425 2.61344 4.32107 1.52945C6.93789 0.445455 9.95007 1.04529 11.952 3.04905C13.2685 4.35966 14.0059 6.14244 14 8.00005C14 10.712 12.1 13.5581 10.5 15.4691C9.43382 16.7416 8.26307 17.9227 7 19ZM7 5.00005C5.92821 5.00005 4.93782 5.57185 4.40193 6.50005C3.86603 7.42825 3.86603 8.57185 4.40193 9.50005C4.93782 10.4283 5.92821 11.0001 7 11.0001C8.65686 11.0001 10 9.6569 10 8.00005C10 6.3432 8.65686 5.00005 7 5.00005Z" fill="' +
                            data.color +
                            '"/></svg>'
                    );
                shape = JSON.parse(data.shape)[0];
                let x = shape.split(' ')[0];
                let y = shape.split(' ')[1];
                this.map.setView([x, y], 10);
                this.markersPoint[data.id] = L.marker([x, y], {
                    icon: L.icon({
                        iconUrl: myIconUrl,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20],
                    }),
                });

                this.markersPoint[data.id].addTo(this.map);
                break;
        }
    }

    createGeometry(e) {
        this.showGeoTools = false;
        this.count++;
        var latlng = this.map.mouseEventToLatLng(e.originalEvent);
        this.paint_punts.push({
            lat: latlng.lat,
            lng: latlng.lng,
        });

        this.punts_geometry.push(latlng.lng);
        this.punts_geometry.push(latlng.lat);
        var latlngs = [this.paint_punts];

        switch (this.type_geo) {
            case 'route':
                this.shape.push(String(latlng.lat + ' ' + latlng.lng));

                this.punt_geometry[this.count] = L.polyline(latlngs, {
                    color: 'blue',
                    weight: 6,
                });
                break;
            case 'zone':
                this.shape.push(String(latlng.lat + ' ' + latlng.lng));

                this.punt_geometry[this.count] = L.polygon(latlngs, {
                    color: 'blue',
                    weight: 6,
                });
                break;
        }

        this.punt_geometry[this.count].addTo(this.map);
    }

    goCancelToGeometry() {
        this.goDeleteGeometryPath();
        this.type_geo = '';
        this.visibleGeo();
        this.showOptionsGeoTools = false;
        this.showFormGeomertry = false;
    }

    goBackToGeometry() {
        var punt;
        for (punt in this.punt_geometry) {
        }
        this.map.removeLayer(this.punt_geometry[punt]);
        delete this.punt_geometry[punt];
        this.paint_punts.pop();
        this.punts_geometry.splice(-2, 2);
    }

    goDeleteGeometryPath() {
        for (const point in this.markersPoint) {
            this.map.removeLayer(this.markersPoint[point]);
        }

        for (const punt in this.punt_geometry) {
            this.map.removeLayer(this.punt_geometry[punt]);
        }

        this.punt_geometry = [];
        this.paint_punts = [];
        this.punts_geometry = [];
    }

    goAddGeometry() {
        this.showFormGeomertry = true;
        this.showOptionsGeoTools = false;
    }

    getPopup(e, data: any) {
        if (this.compRef) this.compRef.destroy();

        // creation component, AppInfoWindowComponent should be declared in entryComponents
        const compFactory =
            this.resolver.resolveComponentFactory(InfoWindowsComponent);
        this.compRef = compFactory.create(this.injector);

        // example of parent-child communication
        this.dataInfoWindows = data;
        this.compRef.instance.data = data;
        const subscription = this.compRef.instance.onRefreshData.subscribe(
            (x) => {
                data;
            }
        );

        let div = document.createElement('div');
        div.appendChild(this.compRef.location.nativeElement);

        this.popup.setLatLng(e.latlng);
        this.popup.setContent(div);
        this.popup.openOn(this.map);

        this.appRef.attachView(this.compRef.hostView);
        this.compRef.onDestroy(() => {
            this.appRef.detachView(this.compRef.hostView);
            subscription.unsubscribe();
        });
    }

    public setIconInfoWindows(data: any): any {
        const iconInfoWindows = [];
        let status = Number(data.status);
        let battery = Number(data.battery);

        // Estado de gps
        switch (data.status_gps) {
            case 'Excelente':
                iconInfoWindows['statusGps'] = 'status_gps_green';
                break;
            case 'Regular':
                iconInfoWindows['statusGps'] = 'status_gps_orange';
                break;
            case 'Mala':
                iconInfoWindows['statusGps'] = 'status_gps_red';
                break;
        }

        // Estado de geobolt
        switch (status) {
            case 0:
                iconInfoWindows['status'] = 'status_open_color';
                break;
            case 1:
                iconInfoWindows['status'] = 'status_close_color';
                break;
        }

        // Estado de señal de el gps
        switch (data.status_signal) {
            case 'Excelente':
                iconInfoWindows['statusSignal'] = 'signal_level_green';
                break;
            case 'Regular':
                iconInfoWindows['statusSignal'] = 'signal_level_orange';
                break;
            case 'Mala':
                iconInfoWindows['statusSignal'] = 'signal_level_red';
                break;
        }

        if (battery >= 0 && battery <= 25) {
            iconInfoWindows['battery'] = 'battery_red';
        } else if (battery >= 26 && battery <= 50) {
            iconInfoWindows['battery'] = 'battery_orange';
        } else if (battery >= 51 && battery <= 75) {
            iconInfoWindows['battery'] = 'battery_yellow';
        } else if (battery >= 76 && battery <= 100) {
            iconInfoWindows['battery'] = 'battery_green';
        }

        return iconInfoWindows;
    }

    /**
     * @description: Asigna los iconos para el marcador deacuerdo al estado
     */
    private setIcon(data: any, type?, color?): any {
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
                            '" stroke="black" stroke-linejoin="round"/></svg>'
                    ),
                iconSize: [36, 36],
                iconAnchor: [18, 18],
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
     * @description: Asigna la rotacion de los iconos de historicos
     */
    private rotationIconHistoric(data: any): any {
        let rotaIcon: any;
        return (rotaIcon = data.orientation);
    }

    async goDetail(id) {
        await this.mobileRequestService.getDetailMobile(id);
        this.showDetailMobile = true;
    }

    async goCommands(plate) {
        this.plate = plate;
        const data = {
            date_init:
                moment(this.initialDate).format('YYYY-MM-DD') + ' 00:00:00',
            date_end:
                moment(this.initialDate).format('YYYY-MM-DD') + ' 23:59:59',
            plate: this.plate,
        };
        await this.mobileRequestService.getCommandsPlate(data);
        this.showCommandsPlate = true;
    }

    getPosition(): Promise<any> {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (resp) => {
                    resolve({
                        lng: resp.coords.longitude,
                        lat: resp.coords.latitude,
                    });
                },
                (err) => {
                    // reject(err);
                }
            );
        });
    }

    getLocation() {
        this.getPosition().then((pos) => {
            this.latitud = pos.lat;
            this.longitud = pos.lng;
        });
    }

    filterTypeService(ev) {
        if (ev.value === 0) {
            this.dataSource = new MatTableDataSource(this.mobiles);
        } else {
            let data = this.mobiles.filter((x) => {
                return x.class_mobile_id === ev.value;
            });
            this.dataSource = new MatTableDataSource(data);
        }
    }
}
