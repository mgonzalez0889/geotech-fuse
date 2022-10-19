import { Component, OnInit } from '@angular/core';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MobilesService } from 'app/core/services/mobiles/mobiles.service';
import moment from 'moment';

@Component({
    selector: 'app-floating-menu-detail',
    templateUrl: './floating-menu-detail.component.html',
    styleUrls: ['./floating-menu-detail.component.scss'],
})
export class FloatingMenuDetailComponent implements OnInit {
    public selectedState: number = 0;
    public seleccionado = [];

    constructor(
        public mapFuncionalitieService: MapFunctionalitieService,
        public mobileRequestService: MobilesService
    ) {}

    ngOnInit(): void {}

    onChange(ev: any, item): any {
        this.mapFuncionalitieService.goDeleteGeometryPath();
        if (ev.checked) {
            let shape = '["' + item.x + ' ' + item.y + '"]';
            this.seleccionado.push({
                ...item,
                shape: shape,
            });
        } else {
            const indx = this.seleccionado.findIndex((x) => x.id === item.id);
            this.seleccionado.splice(indx, indx >= 0 ? 1 : 0);
        }

        this.mapFuncionalitieService.type_geo = 'punt';
        for (let i = 0; i < this.seleccionado.length; i++) {
            const element = this.seleccionado[i];
            this.mapFuncionalitieService.createPunt(element);
        }
    }

    convertDateHour(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
    }
}
