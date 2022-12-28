import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonTools } from 'app/core/tools/common.tool';
import { filter, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalImportGeojsonComponent } from '../modal-import-geojson/modal-import-geojson.component';
import { TypeGeotool } from 'app/core/interfaces';
import { NgxPermissionsObject } from 'ngx-permissions';
import { AuthService } from 'app/core/auth/auth.service';
import { MapToolsService } from '@services/maps/map-tools.service';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { GeotoolMapService } from '@services/api/geotool-map.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';

@Component({
  selector: 'app-panel-map-geotools',
  templateUrl: './panel-map-geotools.component.html',
  styleUrls: ['./panel-map-geotools.component.scss']
})
export class PanelMapGeotoolsComponent implements OnInit, OnDestroy {
  public openedDrawer = false;
  public titlePanel: string = '';
  public dataSource: MatTableDataSource<any>;
  public typePanel: TypeGeotool = 'none';
  public openedForm: boolean = false;
  public dataUpdate: any = null;
  public columnTable: string[] = ['checkbox', 'color', 'name', 'delete', 'edit'];
  private listPermission: NgxPermissionsObject;
  private permissionValid: { [key: string]: string } = {
    create: 'seguimientos:mapa:create',
    update: 'seguimientos:mapa:update',
    delete: 'seguimientos:mapa:delete',
  };
  private dataGeo: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public commonTool: CommonTools,
    public mapService: MapToolsService,
    private toastAlert: ToastAlertService,
    private geotoolMapService: GeotoolMapService,
    private confirmationService: ConfirmationService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.mapService.selectPanelGeoTools$
      .pipe(
        tap(({ titlePanel, typePanel }) => {
          this.titlePanel = titlePanel;
          this.openedForm = false;
          this.verifyPanel(typePanel);
        }),
        mergeMap(({ typePanel }) => this.geotoolMapService.getGeometry(typePanel)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(({ data }: any) => {
        this.dataGeo = [...data || []];
        this.dataSource = new MatTableDataSource([...data || []]);
      });

    this.authService.permissionList
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((permission) => {
        this.listPermission = permission;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openModalImportGeojson(): void {
    if (!this.listPermission[this.permissionValid.create]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }

    const dialogRef = this.dialog.open(ModalImportGeojsonComponent, {
      maxWidth: '360px',
      minWidth: '340px',
      minHeight: '260px',
      maxHeight: '280px',
    });

    dialogRef.afterClosed()
      .pipe(
        mergeMap((data) => {
          const type = this.typePanel === 'punts' ? 'masive_points' : 'owner_maps';
          return this.geotoolMapService.postGeometry(type, data);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        if (data.code === 200) {
          this.refreshData();
          this.toastAlert.toasAlertSuccess({
            message: '¡Geojson importado con exito!'
          });
        } else {
          this.toastAlert.toasAlertWarn({
            message: '¡Lo sentimos algo ha salido mal, vuelva a intentarlo!'
          });
        }
      });
  }

  public closePanelForm({ refreshData }): void {
    if (refreshData) {
      this.refreshData();
    }
    this.dataUpdate = null;
    this.openedForm = false;
    this.mapService.clearGeoTools();
    this.mapService.removeLayer({ id: 999999 }, this.typePanel);
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
    if (!this.listPermission[this.permissionValid.create]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }

    if (this.typePanel === 'punts') {
      this.mapService.createPoint();
    } else {
      this.mapService.createGeometry(this.typePanel);
    }
    this.openedForm = true;
  }

  public actionEdit(data: any): void {
    if (!this.listPermission[this.permissionValid.update]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }
    this.dataUpdate = { ...data };
    this.openedForm = true;
  }

  public deleteGeo(geoId: number): void {
    if (!this.listPermission[this.permissionValid.delete]) {
      this.toastAlert.toasAlertWarn({
        message:
          'No tienes permisos suficientes para realizar esta acción.',
      });
      return;
    }

    const confirmation = this.confirmationService.open();
    confirmation.afterClosed()
      .pipe(
        filter(result => result === 'confirmed'),
        mergeMap(() => this.geotoolMapService.deleteGeometry(this.typePanel, geoId)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((data) => {
        if (data.code === 200) {
          this.toastAlert.toasAlertSuccess({
            message: `${this.titlePanel} eliminado correctamente.`
          });
          this.mapService.removeLayer({ id: geoId }, this.typePanel);
          const indexGeo = this.dataGeo.findIndex(({ id }) => id === geoId);
          if (indexGeo >= 0) {
            this.dataGeo.splice(indexGeo, 1);
            this.dataSource = new MatTableDataSource([...this.dataGeo]);
          }
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

  private refreshData(): void {
    this.geotoolMapService.getGeometry(this.typePanel)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }: any) => {
        this.dataGeo = [...data];
        this.dataSource = new MatTableDataSource([...data || []]);
      });
  }

  private verifyPanel(typePanel: TypeGeotool): void {
    if (this.typePanel === typePanel || this.typePanel === 'none') {
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
