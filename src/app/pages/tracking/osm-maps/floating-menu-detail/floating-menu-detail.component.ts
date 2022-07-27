import { Component, OnInit } from '@angular/core';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MobilesService } from 'app/core/services/mobiles/mobiles.service';

@Component({
  selector: 'app-floating-menu-detail',
  templateUrl: './floating-menu-detail.component.html',
  styleUrls: ['./floating-menu-detail.component.scss']
})
export class FloatingMenuDetailComponent implements OnInit {
  public selectedState: number = 0;

  constructor(
    public mapFuncionalitieService: MapFunctionalitieService,
    public mobileRequestService: MobilesService,
  ) { }

  ngOnInit(): void {
  }

  onChange($event: any): any {
    this.selectedState = $event.value;
  }

}
