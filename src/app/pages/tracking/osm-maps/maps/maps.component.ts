import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import 'leaflet-rotatedmarker';
import moment from 'moment';
import { SocketIoClientService } from '../../../../core/services/socket-io-client.service';
import DriftMarker from 'leaflet-drift-marker';
import { map } from 'lodash';
import { MapService } from 'app/services/maps/map.service';

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
    // public map: L.Map;
    public subscription: Subscription;
    public markers: any = {};
    public mobiles: any = [];
    constructor(
        private mobilesService: MobileService,
        private fleetService: FleetsService,
        private socketIoService: SocketIoClientService,
        public mapService: MapService
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
        this.mapService.setMarkers(mobiles);
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    ngAfterViewInit(): void {
        this.mapService.init();
    }
}
