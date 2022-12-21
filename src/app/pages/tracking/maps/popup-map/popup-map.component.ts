import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IconsModule } from 'app/core/icons/icons.module';
import { IConfigIcon } from 'app/core/interfaces/other/icon.interface';
import { MapToolsService } from 'app/core/services/maps/map-tools.service';
import { DateTools } from 'app/core/tools/date.tool';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupMapComponent implements OnInit, OnDestroy {
  @Input() data: any = null;
  public iconStatus: IConfigIcon = {
    icon: '',
    text: ''
  };
  public iconStatusGps: IConfigIcon = {
    icon: null,
    text: ''
  };
  public iconStatusBattery: IConfigIcon = {
    icon: null,
    text: ''
  };
  public iconStatusSignal: IConfigIcon = {
    icon: null,
    text: ''
  };
  private unsubscribe$ = new Subject<void>();

  constructor(
    public toolDate: DateTools,
    public mapService: MapToolsService,
    private iconService: IconsModule,
    private ref: ChangeDetectorRef,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.assingIcons(this.data);
    this.mapService.mobileSocket$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.ref.markForCheck();
        this.assingIcons(this.data);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  assingIcons(data: any): void {
    this.iconStatus = this.iconService.iconStatus(data);
    this.iconStatusBattery = this.iconService.iconStatusBattery(data);
    this.iconStatusSignal = this.iconService.iconStatusSignal(data);
    this.iconStatusGps = this.iconService.iconStatusGps(data);
  }

}
