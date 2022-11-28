/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { Subscription } from 'rxjs';
import { SocketIoClientService } from 'app/core/services/socket-io-client.service';
import { DriverService } from 'app/core/services/driver.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';

@Component({
  selector: 'app-form-mobiles',
  templateUrl: './form-mobiles.component.html',
  styleUrls: ['./form-mobiles.component.scss'],
})
export class FormMobilesComponent implements OnInit, OnDestroy {
  public mobiles: any = [];
  public editMode: boolean = false;
  public opened: boolean = true;
  public mobilForm: FormGroup;
  public subscription: Subscription;
  public typeMobile: any = [];
  public models: any = [];
  public drivers: any = [];

  constructor(
    private fb: FormBuilder,
    private ownerPlateService: OwnerPlateService,
    private socketIoService: SocketIoClientService,
    private mapToolsService: MapToolsService,
    private driverService: DriverService
  ) { }

  ngOnInit(): void {
    this.mapToolsService.initMap({
      fullscreenControl: true,
      center: [11.004313, -74.808137],
      zoom: 20,
      attributionControl: false,
    });
    //abre el socket y manda el token del usuario
    this.socketIoService.sendMessage('authorization');
    //escucha el socket de new position
    this.socketIoService.listenin('new_position').subscribe((data: any) => {
      this.mapToolsService.moveMarker(data);
    });
    this.listenObservables();
    this.createMobileForm();
    this.getTypePlate();
    this.getModels();
    this.getDriver();
  }
  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.ownerPlateService.behaviorSubjectMobileGrid.next({
      opened: false,
      reload: false,
    });
    this.mapToolsService.clearMap();
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * @description: Escucha el observable behavior y busca al vehiculo
   */
  private listenObservables(): void {
    this.subscription =
      this.ownerPlateService.behaviorSubjectMobileForm.subscribe(
        ({ id }) => {
          if (id) {
            this.ownerPlateService
              .getInfoOwnerPlate(id)
              .subscribe((res) => {
                this.mobiles = res.data;
                delete this.mobiles.id;
                this.mobiles.id = this.mobiles.mobile_id;
                this.mapToolsService.clearMap();
                this.mapToolsService.setMarkers([this.mobiles]);
              });
          }
        }
      );
  }
  private getTypePlate(): any {
    this.ownerPlateService.getTypePlate().subscribe((res) => {
      this.typeMobile = res.data;
    });
  }

  private getModels(): any {
    const year = new Date().getFullYear();
    for (let i = 1990; i <= year; i++) {
      this.models.push(i);
    }
  }
  /**
   * @description: Buscar los dispositivos aptos para crear un despacho
   */
  private getDriver(): void {
    this.driverService.getDrivers().subscribe((res) => {
      this.drivers = res.data;
    });
  }

  /**
   * @description: Inicializa el formulario de moviles
   */
  private createMobileForm(): void {
    this.mobilForm = this.fb.group({
      id: [''],
      brand: [''],
      color: [''],
      type_mobile_id: [''],
      mobile_model: [''],
      owner_driver_id: [''],
      capacity: [''],
      number_chassis: [''],
      number_engine: [''],
      type_of_service_id: [''],
      weight_unit: [''],
      number_passengers: [''],
      full_name: [''],
    });
  }
}
