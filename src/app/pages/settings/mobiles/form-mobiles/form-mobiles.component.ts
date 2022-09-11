import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MobileService } from 'app/core/services/mobile.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form-mobiles',
    templateUrl: './form-mobiles.component.html',
    styleUrls: ['./form-mobiles.component.scss'],
})
export class FormMobilesComponent implements OnInit {
    public contacts: any = [];
    public editMode: boolean = false;
    public opened: boolean = true;
    public contactForm: FormGroup;
    public subscription: Subscription;

    constructor(
        private fb: FormBuilder,
        public mapFunctionalitieService: MapFunctionalitieService,
        private mobileService: MobileService
    ) {}

    ngOnInit(): void {
        this.loadMap();
    }
    /**
     * @description: Cierra el menu lateral de la derecha
     */
    public closeMenu(): void {
        this.mobileService.behaviorSubjectMobileGrid.next({
            opened: false,
            reload: false,
        });
    }
    /**
     * @description: Para cargar el mapa
     */
    private loadMap(): void {
        this.mapFunctionalitieService.init();
        // const time = timer(1000);
        // time.subscribe((t) => {
        //     this.getPointMap(this.selectedAlarm);
        // });
    }
}
