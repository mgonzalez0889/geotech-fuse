/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { Subscription } from 'rxjs';
import { SocketIoClientService } from 'app/core/services/socket-io-client.service';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { DriverService } from 'app/core/services/driver.service';

@Component({
    selector: 'app-form-mobiles',
    templateUrl: './form-mobiles.component.html',
    styleUrls: ['./form-mobiles.component.scss'],
})
export class FormMobilesComponent implements OnInit, OnDestroy, AfterViewInit {
    public mobiles: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public mobilForm: FormGroup;
    public subscription: Subscription;
    public typeMobile: any = [];
    public models: any = [];
    public drivers: any = [];
    public typeSrvices: any = [
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
    public weightUnit: any = [
        {
            id: 0,
            name: 'Kg',
        },
        {
            id: 1,
            name: 'Ton',
        },
    ];

    constructor(
        private fb: FormBuilder,
        private ownerPlateService: OwnerPlateService,
        private socketIoService: SocketIoClientService,
        private mapToolsService: MapToolsService,
        private driverService: DriverService
    ) {}

    ngOnInit(): void {
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
     * @description: Para cargar el mapa
     */
    ngAfterViewInit(): void {
        this.mapToolsService.initMap();
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
                                this.mapToolsService.setMarkers(
                                    [this.mobiles],
                                    (this.mapToolsService.verCluster = false),
                                    (this.mapToolsService.verLabel = true)
                                );
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
        for (let i = 1990; i <= year + 1; i++) {
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
            weight_capacity: [''],
            number_chassis: [''],
            number_engine: [''],
            type_of_service_id: [''],
            weight_unit: [0],
            number_passengers: [''],
            internal_code: [''],
        });
    }
}
