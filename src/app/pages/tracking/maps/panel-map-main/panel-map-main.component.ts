import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IMobiles } from '@interface/index';
import { FleetsService } from '@services/api/fleets.service';
import { MobileService } from '@services/api/mobile.service';
import { MapToolsService } from '@services/maps/map-tools.service';
import { DateTools } from '@tools/date.tool';
import { IconsModule } from 'app/core/icons/icons.module';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { FormReportMapComponent } from '../form-report-map/form-report-map.component';
import { TranslocoService } from '@ngneat/transloco';

type TypeService = { classMobileId: number; classMobileName: string };

@Component({
  selector: 'app-panel-map-main',
  templateUrl: './panel-map-main.component.html',
  styleUrls: ['./panel-map-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelMapMainComponent implements OnInit, OnDestroy {
  public mobileData: any[] = [];
  public fleets: any[] = [];
  public dataSource: MatTableDataSource<any>;
  public dataSourceFleets: MatTableDataSource<any>;
  public displayedColumns: string[] = ['checkbox', 'select', 'code', 'icon', 'menu'];
  public typeServices: TypeService[] = [];
  public typeServiceId: number = 0;
  public selectPlates: any[] = [];
  public selectFleet: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public toolDate: DateTools,
    public mapService: MapToolsService,
    public iconService: IconsModule,
    private dialog: MatDialog,
    private fleetService: FleetsService,
    private mobilesService: MobileService,
    private ref: ChangeDetectorRef,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.readMobiles();
    }, 700);

    this.fleetService.selectState(state => state.fleets)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((fleets) => {
        this.fleets = [...fleets || []];
        this.dataSourceFleets = new MatTableDataSource([...fleets || []]);
      });

    this.translocoService.langChanges$
      .pipe(delay(500), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.ref.markForCheck();
      });

    this.refreshDataSocket();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Filtra por tipo de servicio o dispositivo
   */
  public filterForTypeService(e: any): void {
    if (e.value === 0) {
      this.dataSource = new MatTableDataSource([...this.mobileData]);
      return;
    }

    const dataFilter = this.mobileData.filter(
      ({ class_mobile_id }) => class_mobile_id === e.value
    );

    this.dataSource = new MatTableDataSource([...dataFilter]);
    this.typeServiceId = e.value;
  }

  /**
   * @description: Selecciona mobiles con los check y se muestran en el mapa
   */
  public selectMobiles(checked: boolean, data: IMobiles): void {
    if (checked) {
      this.selectPlates.push(data);
    } else {
      const indexPlate = this.selectPlates.findIndex(({ plate }) => plate === data.plate);
      this.selectPlates.splice(indexPlate, 1);
    }

    if (!this.selectPlates.length) {
      this.mapService.clearMap();
      this.mapService.setMarkers(this.mobileData, true);
    } else {
      this.mapService.clearMap();
      this.mapService.setMarkers(this.selectPlates, true);
    }

    if (this.mapService.compRef) {
      this.mapService.compRef.destroy();
      this.mapService.popup.close();
    };
  }

  /**
   * @description: Selecciona flotas con los check y se muestran en el mapa
   */
  public selectFleets(checked: boolean, data: any): void {
    if (checked) {
      this.selectFleet.push(data);
    } else {
      const indexPlate = this.selectFleet.findIndex(({ id }) => id === data.id);
      this.selectFleet.splice(indexPlate, 1);
    }

    if (!this.selectFleet.length) {
      this.mapService.clearMap();
      this.mapService.setMarkers(this.mobileData, true);
    } else {
      const exitsPlate = {};
      const platesFLeets = this.selectFleet
        .flatMap(({ plates }) => plates)
        .filter(({ plate }) => exitsPlate[plate] ? false : exitsPlate[plate] = true);
      this.mapService.clearMap();
      this.mapService.setMarkers(platesFLeets, true);
    }
  }

  /**
   * @description: Modal para generar los reportes
   */
  public generateReport(): void {
    this.dialog.open(FormReportMapComponent, {
      maxWidth: '410px',
      minWidth: '390px',
      minHeight: '340px',
      maxHeight: '360px',
      data: {
        plates: this.selectPlates.map(({ plate }) => plate)
      }
    });
  }

  /**
   * @description: Filtra registros de la table de placas
   */
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Filtra registros en la tabla de flotas
   */
  public applyFilterFleets(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFleets.filter = filterValue.trim().toLowerCase();
  }

  public closePanel(): void {
    this.selectFleet = [];
    this.selectPlates = [];
    this.mapService.clearMap();
    this.mapService.setMarkers(this.mobileData, true);
  }

  /**
   * @description: refrescamos la data en el panel cuando llegue data por socket
   */
  private refreshDataSocket(): void {
    this.mapService.mobileSocket$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.ref.markForCheck();
        const indexMobile: number = this.mobileData.findIndex(({ plate }) => plate === data.plate);
        if (indexMobile >= 0) {
          const dataMobile = this.mobileData[indexMobile];
          this.mobileData[indexMobile] = Object.assign(dataMobile, data);
        }
      });
  }

  /**
   * @description: leemos toda la informacion de los moviles y la mostramos en el panel, y se parsea los tipos de servicios que vengan
   */
  private readMobiles(): void {
    this.mobilesService.getMobiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.mobileData = [...data];
        this.dataSource = new MatTableDataSource([...data]);
        this.mobileData.forEach((valueMobile) => {
          const validTypeService: boolean = this.typeServices.some(
            ({ classMobileId }) => classMobileId === valueMobile.class_mobile_id
          );
          if (!validTypeService) {
            this.typeServices.push({
              classMobileId: valueMobile.class_mobile_id,
              classMobileName: valueMobile.class_mobile_name
            });
          }
        });
      });
  }

}
