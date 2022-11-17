/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { MobileService } from 'app/core/services/mobile.service';
import { FleetsService } from 'app/core/services/fleets.service';
import { SocketIoClientService } from '../../../../core/services/socket-io-client.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { IconService } from 'app/core/services/icons/icon.service';
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
    // {
    //     name: 'type-map',
    //     type: 'change-map'
    // },
    {
      name: 'route-map',
      type: 'route',
    },
    {
      name: 'zone-map',
      type: 'zone',
    },
    {
      name: 'point-map',
      type: 'punt',
    },
    {
      name: 'map',
      type: 'owner_map',
    },
    // {
    //     name: 'settings-map'
    // }
  ];

  optionsGeo: any = [
    {
      icon: 'geo-cancel',
      name: 'Cancelar',
      type: 1,
    },
    {
      icon: 'geo-back',
      name: 'Retroceder',
      type: 2,
    },
    {
      icon: 'geo-clear',
      name: 'Limpiar',
      type: 3,
    },
    {
      icon: 'geo-save',
      name: 'Agregar',
      type: 4,
    },
    {
      icon: 'geo-save',
      name: 'Importar',
      type: 5,
    },
  ];

  constructor(
    private mobilesService: MobileService,
    private fleetService: FleetsService,
    private socketIoService: SocketIoClientService,
    public mapService: MapFunctionalitieService,
    public iconService: IconService,
    private mapRequestService: MapRequestService
  ) {

  }

  ngOnInit(): void {
    this.iconService.loadIcons();

    //abre el socket y manda el token del usuario
    this.socketIoService.sendMessage('authorization');

    //escucha el socket de new position
    this.socketIoService.listenin('new_position').subscribe((data: any) => {
      console.log('socket chanel', data);

      this.mapService.moveMarker(data);
    });

    this.socketIoService
      .listenin('new_command')
      .subscribe((data: any) => {

        console.log('command ', data);
      });

    const time = timer(2000);

    time.subscribe((t) => {
      console.log('a');

      this.getMobiles();
    });
  }

  /**
   * @description: Obtengo las flotas y vehiculos del cliente
   */
  getMobiles(): void {
    // vehiculos del cliente
    this.subscription = this.mobilesService
      .getMobiles()
      .subscribe((data) => {
        this.mapService.mobiles = data.data.map((x) => {
          x['selected'] = false;
          return x;
        });
        this.mapService.dataSource =
          new MatTableDataSource(
            this.mapService.mobiles
          );
        this.mapService.setMarkers(
          data.data,
          this.mapService.verCluster,
          this.mapService.verLabel
        );

        const alls = {
          class_mobile_id: 0,
          class_mobile_name: 'Todos',
        };

        this.mapService.type_service.push(alls);

        for (
          let i = 0;
          i < this.mapService.mobiles.length;
          i++
        ) {
          const element = this.mapService.mobiles[i];

          if (
            Object.keys(this.mapService.type_service)
              .length
          ) {
            const validate =
              this.mapService.type_service.filter(
                (x) => {
                  return (
                    x.class_mobile_id ===
                    element.class_mobile_id
                  );
                }
              );

            if (!validate.length) {

              this.mapService.type_service.push(
                element
              );
            }
          } else {

            this.mapService.type_service.push(
              element
            );
          }
        }
      });

    // Flotas de el cliente
    this.subscription = this.fleetService.getFleets().subscribe((data) => {
      this.mapService.fleets = data.data;
      this.mapService.fleets.map((x) => {
        x['selected'] = false;
        return x;
      });
      this.mapService.dataSourceFleets =
        new MatTableDataSource(this.mapService.fleets);
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  ngAfterViewInit(): void {
    this.mapService.init();
    this.mapService.getLocation();
  }

  async eventClick(type) {
    switch (type) {
      case 'settings-map':
        break;
      case 'route':
        this.mapService.drawerOpenedChanged();
        this.mapService.type_geometry = 'Rutas';
        this.mapService.type_geo = type;
        (await this.mapRequestService.getGeometry(type + 's')) || [];
        break;
      case 'zone':
        this.mapService.drawerOpenedChanged();
        this.mapService.type_geometry = 'Zonas';
        this.mapService.type_geo = type;
        (await this.mapRequestService.getGeometry(type + 's')) || [];
        break;
      case 'punt':
        this.mapService.drawerOpenedChanged();
        this.mapService.type_geometry =
          'Puntos de control';
        this.mapService.type_geo = type;
        (await this.mapRequestService.getGeometry(type + 's')) || [];
        break;
      case 'owner_map':
        this.mapService.drawerOpenedChanged();
        this.mapService.type_geometry = 'Capas de mapas';
        this.mapService.type_geo = type;
        (await this.mapRequestService.getGeometry(type + 's')) || [];
        break;
    }
  }

  eventOptionGeotools(type): any {
    if (type === 1) {
      this.mapService.goCancelToGeometry();
    } else if (type === 2) {
      this.mapService.goBackToGeometry();
    } else if (type === 3) {
      this.mapService.goDeleteGeometryPath();
    } else if (type === 5) {
      this.mapService.goImportGeometry();
    } else {
      this.mapService.goAddGeometry();
    }
  }

  setCluster(ev) {
    if (this.mapService.mobile_set.length) {
      this.mapService.verCluster = ev.checked;
      this.mapService.deleteChecks(
        this.mapService.mobile_set
      );
      this.mapService.setMarkers(
        this.mapService.mobile_set,
        this.mapService.verCluster,
        this.mapService.verLabel
      );
    } else {
      this.mapService.verCluster = ev.checked;
      this.mapService.deleteChecks(
        this.mapService.mobiles
      );
      this.mapService.setMarkers(
        this.mapService.mobiles,
        this.mapService.verCluster,
        this.mapService.verLabel
      );
    }
  }

  setLabel(ev) {
    if (this.mapService.mobile_set.length) {
      this.mapService.verLabel = ev.checked;
      this.mapService.deleteChecks(
        this.mapService.mobile_set
      );
      this.mapService.setMarkers(
        this.mapService.mobile_set,
        this.mapService.verCluster,
        this.mapService.verLabel
      );
    } else {
      this.mapService.verLabel = ev.checked;
      this.mapService.deleteChecks(
        this.mapService.mobiles
      );
      this.mapService.setMarkers(
        this.mapService.mobiles,
        this.mapService.verCluster,
        this.mapService.verLabel
      );
    }
  }
}
