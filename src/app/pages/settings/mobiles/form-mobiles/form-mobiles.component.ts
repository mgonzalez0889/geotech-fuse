/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerPlateService } from 'app/core/services/api/owner-plate.service';
import { Subject } from 'rxjs';
import { SocketIoClientService } from 'app/core/services/socket/socket-io-client.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { DriverService } from 'app/core/services/api/driver.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-mobiles',
  templateUrl: './form-mobiles.component.html',
  styleUrls: ['./form-mobiles.component.scss'],
})
export class FormMobilesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() dataMobile: any = null;
  @Output() closeForm = new EventEmitter<void>();
  public detailMobile: any = {};
  public editMode: boolean = false;
  public mobilForm: FormGroup = this.fb.group({});
  public typeMobile: any = [];
  public models: any = [];
  public drivers: any = [];
  public typeServices: any = [
    {
      id: 0,
      name: 'Comercial',
    },
    {
      id: 1,
      name: 'Especial',
    },
    {
      id: 2,
      name: 'Internacional',
    },
    {
      id: 3,
      name: 'Privado',
    },
    {
      id: 4,
      name: 'Publico',
    },
  ];

  private unsubscribe$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private ownerPlateService: OwnerPlateService,
    private socketIoService: SocketIoClientService,
    private mapToolsService: MapToolsService,
    private driverService: DriverService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.listenChanelSocket();
    this.ownerPlateService
      .getInfoOwnerPlate(this.dataMobile.plate_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.detailMobile = { ...data };
        this.mobilForm.patchValue({ ...data });
      });

    this.driverService.getDrivers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.drivers = res.data;
      });

    this.ownerPlateService.getTypePlate()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.typeMobile = res.data;
      });
    this.getModels();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
    this.mapToolsService.initMap({
      fullscreenControl: true,
      center: [11.004313, -74.808137],
      zoom: 20,
      attributionControl: false,
    });

    this.mapToolsService.setMarker(
      this.dataMobile,
    );
  }

  public sendData(): void {
    const formData = this.mobilForm.value;
    console.log(formData);
    this.ownerPlateService.putOwnerPlate(formData, this.detailMobile.id).subscribe((data) => {
      console.log('data', data);
    });
  }

  /**
   * @description: Cierra el menu lateral de la derecha
   */
  public closeMenu(): void {
    this.closeForm.emit();
    this.mapToolsService.clearMap();
  }

  private getModels(): any {
    const year = new Date().getFullYear();
    for (let i = 1990; i <= year + 1; i++) {
      this.models.push(i);
    }
  }

  private listenChanelSocket(): void {
    this.socketIoService.sendMessage('authorization');
    this.socketIoService.listenin('new_position')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        console.log('ay', data);
        this.mapToolsService.moveMakerSelect(data);
      });
  }

  /**
   * @description: Inicializa el formulario de moviles
   */
  private buildForm(): void {
    this.mobilForm = this.fb.group({
      brand: ['', [Validators.required]],
      color: ['', [Validators.required]],
      type_mobile_id: [''],
      mobile_model: [''],
      owner_driver_id: [''],
      weight_capacity: [''],
      number_chassis: ['', [Validators.required]],
      number_engine: ['', [Validators.required]],
      type_of_service_id: [''],
      weight_unit: [0],
      number_passengers: [''],
      internal_code: [''],
    });
  }
}
