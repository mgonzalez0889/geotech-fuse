import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { GeotoolMapService } from 'app/core/services/api/geotool-map.service';
import { ToastAlertService } from 'app/core/services/toast-alert/toast-alert.service';
import { CommonTools } from 'app/core/tools/common.tool';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { MapToolsService } from '../../../../core/services/maps/map-tools.service';

@Component({
  selector: 'app-panel-map-geotools',
  templateUrl: './panel-map-geotools.component.html',
  styleUrls: ['./panel-map-geotools.component.scss']
})
export class PanelMapGeotoolsComponent implements OnInit {
  public openedDrawer = false;
  public titlePanel: string = '';
  public dataSource: MatTableDataSource<any>;
  public typePanel: string = '';
  public openedForm: boolean = false;
  public columnTable: string[] = ['checkbox', 'color', 'name', 'delete'];
  private dataGeo: any[] = [];
  constructor(
    public commonTool: CommonTools,
    public mapService: MapToolsService,
    private toastAlert: ToastAlertService,
    private geotoolMapService: GeotoolMapService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.mapService.selectPanelGeoTools$
      .pipe(
        tap(({ titlePanel, typePanel }) => {
          this.titlePanel = titlePanel;
          this.openedForm = false;
          this.verifyPanel(typePanel);
        }),
        mergeMap(({ typePanel }) => this.geotoolMapService.getGeometry(typePanel))
      )
      .subscribe(({ data }: any) => {
        this.dataGeo = [...data];
        this.dataSource = new MatTableDataSource([...data || []]);
      });
  }

  public actionCheckbox(check: boolean, data: any): void {
    if (!check) {
      this.mapService.removeLayer(data, this.typePanel);
    } else {
      switch (this.typePanel) {
        case 'punts':
          this.mapService.viewPoint(data);
          break;
        case 'routes':
          this.mapService.viewRoutes(data);
          break;
        case 'zones':
          this.mapService.viewZones(data);
          break;
      }
    }
  }

  public actionAdd(): void {
    this.mapService.createPoint();
    this.openedForm = true;

  }

  public deleteGeo(geoId: number): void {
    const confirmation = this.confirmationService.open();
    confirmation.afterClosed()
      .pipe(
        filter(result => result === 'confirmed'),
        mergeMap(() => this.geotoolMapService.deleteGeometry(this.typePanel, geoId))
      )
      .subscribe((data) => {
        if (data.code === 200) {
          this.toastAlert.toasAlertSuccess({
            message: `${this.titlePanel} eliminado correctamente.`
          });
          const indexGeo = this.dataGeo.findIndex(({ id }) => id === geoId);
          this.dataGeo.splice(indexGeo, 1);
          this.dataSource = new MatTableDataSource([...this.dataGeo]);
        } else {
          this.toastAlert.toasAlertWarn({
            message: '¡Lo sentimos algo ha salido mal, vuelva a intentarlo!'
          });
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

  private verifyPanel(typePanel: string): void {
    if (this.typePanel === typePanel || this.typePanel === '') {
      this.openedDrawer = !this.openedDrawer;
    } else {
      this.openedDrawer = !this.openedDrawer;
      setTimeout(() => {
        this.openedDrawer = !this.openedDrawer;
      }, 500);
    }
    this.typePanel = typePanel;
  }
}
