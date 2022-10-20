/* eslint-disable @typescript-eslint/naming-convention */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OwnerPlateService } from 'app/core/services/owner-plate.service';
import { Subscription, timer } from 'rxjs';
import { SocketIoClientService } from 'app/core/services/socket-io-client.service';
import { MapToolsService } from 'app/core/services/map-tools.service';

@Component({
    selector: 'app-form-mobiles',
    templateUrl: './form-mobiles.component.html',
    styleUrls: ['./form-mobiles.component.scss'],
})
export class FormMobilesComponent implements OnInit, OnDestroy, AfterViewInit {
    public mobiles: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public contactForm: FormGroup;
    public subscription: Subscription;

    constructor(
        private fb: FormBuilder,
        private ownerPlateService: OwnerPlateService,
        private socketIoService: SocketIoClientService,
        private mapToolsService: MapToolsService
    ) {}

    ngOnInit(): void {
        //abre el socket y manda el token del usuario
        this.socketIoService.sendMessage('authorization');
        //escucha el socket de new position
        this.socketIoService.listenin('new_position').subscribe((data: any) => {
            this.mapToolsService.moveMarker(data);
        });
        this.listenObservables();
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        this.ownerPlateService.behaviorSubjectMobileGrid.next({
            opened: false,
            reload: false,
        });
        this.mapToolsService.deleteOneChecks(this.mobiles.id);
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
        //this.mapFunctionalitieService.init();
        //this.mapFunctionalitieService.getLocation();
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
                                this.mapToolsService.deleteOneChecks(
                                    this.mobiles.id
                                );
                                const time = timer(2000);
                                time.subscribe((t) => {
                                    this.mapToolsService.setMarkers(
                                        [this.mobiles],
                                        (this.mapToolsService.verCluster =
                                            false),
                                        (this.mapToolsService.verLabel = true)
                                    );
                                });

                                // this.getContact(res.contacts);
                                // this.eventForm.patchValue(this.events);
                            });
                    }
                }
            );
    }
}
