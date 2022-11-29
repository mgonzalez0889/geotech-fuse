import { Component, Input, OnInit } from '@angular/core';
import { IconsModule } from 'app/core/icons/icons.module';
import { IConfigIcon } from 'app/core/interfaces/other/icon.interface';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { DateTools } from 'app/core/tools/date.tool';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.scss']
})
export class PopupMapComponent implements OnInit {
  @Input() data: any = null;
  public iconStatus: IConfigIcon = {
    icon: '',
    text: ''
  };
  public iconStatusGps: IConfigIcon = {
    icon: '',
    text: ''
  };
  public iconStatusBattery: IConfigIcon = {
    icon: '',
    text: ''
  };
  public iconStatusSignal: IConfigIcon = {
    icon: '',
    text: ''
  };

  constructor(
    public toolDate: DateTools,
    public mapService: MapToolsService,
    private iconService: IconsModule,
  ) { }


  ngOnInit(): void {
    this.assingIcons(this.data);
    this.mapService.mobileSocketData$
      .subscribe(() =>
        this.assingIcons(this.data)
      );
  }

  assingIcons(data: any): void {
    this.iconStatus = this.iconService.iconStatus(data);
    this.iconStatusBattery = this.iconService.iconStatusBattery(data);
    this.iconStatusSignal = this.iconService.iconStatusSignal(data);
    this.iconStatusGps = this.iconService.iconStatusGps(data);
  }

}
