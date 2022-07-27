import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { SocketIoClientService } from '../../../../core/services/socket-io-client.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { IconService } from 'app/core/services/icons/icon.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MapRequestService } from 'app/core/services/request/map-request.service';

@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit, AfterViewInit {

    public showHistory: boolean = false;
    public showMenuFleet: boolean = false;
    public subscription: Subscription;
    public markers: any = {};
    public mobiles: any = [];
    public dataSource: any = [];

    optionsIcons: any = [
        {
            name: 'type-map'
        },
        {
            name: 'route-map',
            type: 'route'
        },
        {
            name: 'zone-map',
            type: 'zone'
        },
        {
            name: 'point-map',
            type: 'punt'
        },
        {
            name: 'settings-map'
        }
    ]

    optionsGeo: any = [
        {
            icon: 'geo-cancel',
            name: 'Cancelar',
            type: 1
        },
        {
            icon: 'geo-back',
            name: 'Retroceder',
            type: 2
        },
        {
            icon: 'geo-clear',
            name: 'Limpiar',
            type: 3
        },
        {
            icon: 'geo-save',
            name: 'Agregar',
            type: 4
        }
    ]

    constructor(
        private mobilesService: MobileService,
        private fleetService: FleetsService,
        private socketIoService: SocketIoClientService,
        public mapFunctionalitieService: MapFunctionalitieService,
        public iconService: IconService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private mapRequestService: MapRequestService
    ) {
        iconRegistry.addSvgIcon('settings-map', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/settings.svg'));
        iconRegistry.addSvgIcon('type-map', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/type-map.svg'));
        iconRegistry.addSvgIcon('route-map', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/route.svg'));
        iconRegistry.addSvgIcon('zone-map', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/zone.svg'));
        iconRegistry.addSvgIcon('point-map', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/point.svg'));
        iconRegistry.addSvgIcon('geo-cancel', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-cancel.svg'));
        iconRegistry.addSvgIcon('geo-back', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-back.svg'));
        iconRegistry.addSvgIcon('geo-clear', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-clear.svg'));
        iconRegistry.addSvgIcon('geo-save', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/geo-save.svg'));
    }

    ngOnInit(): void {
        this.iconService.loadIcons();
        //abre el socket y manda el token del usuario
        this.socketIoService.sendMessage('authorization');
        //escucha el socket de new position
        this.socketIoService.listenin('new_position').subscribe((data: any) => {
            this.mapFunctionalitieService.moveMarker(data);
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
                this.mapFunctionalitieService.mobiles = data.data;
                this.mapFunctionalitieService.mobiles.map((x) => {
                    x['selected'] = false;
                    return x;
                });
                this.mapFunctionalitieService.dataSource = new MatTableDataSource(this.mapFunctionalitieService.mobiles);
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
        this.mapFunctionalitieService.setMarkers(mobiles);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    ngAfterViewInit(): void {
        this.mapFunctionalitieService.init();
    }

    async eventClick(type) {
        switch (type) {
            case 'route':
                this.mapFunctionalitieService.drawerOpenedChanged();
                this.mapFunctionalitieService.type_geometry = 'Rutas';
                this.mapFunctionalitieService.type_geo = type;
                await this.mapRequestService.getGeometry(type + 's') || [];
                break;
            case 'zone':
                this.mapFunctionalitieService.drawerOpenedChanged();
                this.mapFunctionalitieService.type_geometry = 'Zonas';
                this.mapFunctionalitieService.type_geo = type;
                await this.mapRequestService.getGeometry(type + 's') || [];
                break;
            case 'punt':
                this.mapFunctionalitieService.drawerOpenedChanged();
                this.mapFunctionalitieService.type_geometry = 'Puntos de control';
                this.mapFunctionalitieService.type_geo = type;
                await this.mapRequestService.getGeometry(type + 's') || [];
                break;
        }
    }

    eventOptionGeotools(type) {
        console.log(type);
        if (type === 1) {
            this.mapFunctionalitieService.goCancelToGeometry();
        } else if (type === 2) {
            this.mapFunctionalitieService.goBackToGeometry();
        } else if (type === 3) {
            this.mapFunctionalitieService.goDeleteGeometryPath();
        } else {
            this.mapFunctionalitieService.goAddGeometry();
        }
    }
}

