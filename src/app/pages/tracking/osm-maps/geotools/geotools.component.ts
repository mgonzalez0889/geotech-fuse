import { Component, OnInit } from '@angular/core';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MapRequestService } from 'app/core/services/request/map-request.service';
import { Subscription, timer } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-geotools',
  templateUrl: './geotools.component.html',
  styleUrls: ['./geotools.component.scss']
})
export class GeotoolsComponent implements OnInit {

  public animationStates: any;
  public visibilityStates: any;
  public subscription: Subscription;
  public displayedColumns: string[] = ['select', 'name', 'satellite'];

  public selection = new SelectionModel(true, []);

  isSelected = false;

  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
    public mapRequestService: MapRequestService
  ) {


  }

  ngOnInit(): void {
  }

  onListSelectionChange(options) {
    this.mapFunctionalitieService.goDeleteGeometryPath();
    if (Object.keys(options).length) {
      for (let i = 0; i < options.length; i++) {
        const element = options[i].value;
        this.mapFunctionalitieService.createPunt(element);
      }
    }
  }
}
