import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GeotoolMapService } from 'app/core/services/maps/geotool-map.service';
import { CommonTools } from 'app/core/tools/common.tool';
import { mergeMap, tap } from 'rxjs/operators';
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
  constructor(
    public commonTool: CommonTools,
    private mapService: MapToolsService,
    private geotoolMapService: GeotoolMapService
  ) { }

  ngOnInit(): void {
    this.mapService.selectPanelGeotool$
      .pipe(
        tap(({ titlePanel, typePanel }) => {
          this.titlePanel = titlePanel;
          this.verifyPanel(typePanel);
        }),
        mergeMap(({ typePanel }) => this.geotoolMapService.getGeometry(typePanel))
      )
      .subscribe(({ data }: any) => {
        this.dataSource = new MatTableDataSource([...data || []]);
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
