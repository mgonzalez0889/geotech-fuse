import { Component, OnInit } from '@angular/core';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';

@Component({
  selector: 'app-panel-map-commands',
  templateUrl: './panel-map-commands.component.html',
  styleUrls: ['./panel-map-commands.component.scss']
})
export class PanelMapCommandsComponent implements OnInit {

  constructor(public mapService: MapToolsService) { }

  ngOnInit(): void {
  }

}
