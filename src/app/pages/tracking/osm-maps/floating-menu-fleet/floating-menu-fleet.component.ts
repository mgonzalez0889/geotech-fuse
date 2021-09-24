import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FleetsService} from "../../../../core/services/fleets.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {HistoriesService} from "../../../../core/services/histories.service";
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
  selector: 'app-floating-menu-fleet',
  templateUrl: './floating-menu-fleet.component.html',
  styleUrls: ['./floating-menu-fleet.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations:   fuseAnimations
})
export class FloatingMenuFleetComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public dataSource: any = [];
  public displayedColumns: string[] = ['select'];
  public animationStates: any;
  public visibilityStates: any;
  public selection = new SelectionModel<any>(true, []);
  public showMenuGroup: boolean = false;
  public showReport: boolean = true;
  public showMenu: boolean = true;
  constructor(
      private fleetServices: FleetsService,
      private historiesService: HistoriesService,
  ) {
      this.animationStates = {
          expandCollapse: 'expanded',
          fadeIn        : {
              direction: 'in',
              in       : '*',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          fadeOut       : {
              direction: 'out',
              out      : '*',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          shake         : {
              shake: true
          },
          slideIn       : {
              direction: 'top',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          slideOut      : {
              direction: 'top',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          zoomIn        : {
              in: '*'
          },
          zoomOut       : {
              out: '*'
          }
      };

      this.visibilityStates = {
          expandCollapse: true,
          fadeIn        : {
              in    : true,
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          fadeOut       : {
              out   : true,
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          shake         : {
              shake: true
          },
          slideIn       : {
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          slideOut      : {
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          zoomIn        : {
              in: true
          },
          zoomOut       : {
              out: true
          }
      };
  }



  ngOnInit(): void {
      this.getFleets();
  }
  /**
   * @description: Submenu de opciones
   */
  public onShowMenuGroup(): void {
      this.showMenuGroup = ! this.showMenuGroup;
  }

  public onShowMenuMobile(): void {
      this.historiesService.floatingMenuMobile$.next({show: true});
  }

  public selectOne(event, value): void {
      console.log(event);
      console.log(value);

  }

    /**
     * @description: Carga las flotas
     */
  private getFleets(): void {
      this.subscription = this.fleetServices.getFleets().subscribe(({data}) => {
          data.map((x) => {
              x['selected'] = false;
              return x;
          });
          console.log(data);
          this.dataSource = new MatTableDataSource(data);
      });

  }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
