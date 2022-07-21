import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';

@Component({
    selector: 'app-control-center-actions',
    templateUrl: './control-center-actions.component.html',
    styleUrls: ['./control-center-actions.component.scss'],
})
export class ControlCenterActionsComponent implements OnInit, AfterViewInit {
    public today = new Date();
    public month = this.today.getMonth();
    public year = this.today.getFullYear();
    public day = this.today.getDate();
    public initialDate: Date = new Date(this.year, this.month, this.day);
    public finalDate: Date = new Date(this.year, this.month, this.day);
    constructor(public mapFunctionalitieService: MapFunctionalitieService) {}

    ngOnInit(): void {}

    ngAfterViewInit(): void {
        this.mapFunctionalitieService.init();
    }
}
