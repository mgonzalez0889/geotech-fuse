import { Component, Input, OnInit } from '@angular/core';
import { IconsModule } from 'app/core/icons/icons.module';
import { IConfigIcon } from 'app/core/interfaces/other/icon.interface';
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
    private iconService: IconsModule
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.iconStatus = this.iconService.iconTypeService(this.data, this.data.class_mobile_name);
    this.iconStatusBattery = this.iconService.iconStatusBattery(this.data);
    this.iconStatusSignal = this.iconService.iconStatusSignal(this.data);
    this.iconStatusGps = this.iconService.iconStatusGps(this.data);
  }

}
