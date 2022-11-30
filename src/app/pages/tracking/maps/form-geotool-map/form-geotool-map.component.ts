import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';

@Component({
  selector: 'app-form-geotool-map',
  templateUrl: './form-geotool-map.component.html',
  styleUrls: ['./form-geotool-map.component.scss']
})
export class FormGeotoolMapComponent implements OnInit {
  @Input() titleForm: string = '';
  @Output() closeForm = new EventEmitter<boolean>();

  constructor(private mapService: MapToolsService) { }

  ngOnInit(): void {
  }

}
