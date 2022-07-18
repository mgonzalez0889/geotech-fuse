import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MapService } from 'app/core/services/map.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-geotools',
  templateUrl: './geotools.component.html',
  styleUrls: ['./geotools.component.scss']
})
export class GeotoolsComponent implements OnInit {

  public animationStates: any;
  public visibilityStates: any;
  public subscription: Subscription;
  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private mapService: MapService
  ) {

    this.iconRegistry.addSvgIcon('plus-border', this.sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iconMap/plus-border.svg'));

    this.animationStates = {
      expandCollapse: 'expanded',
      fadeIn: {
        direction: 'in',
        in: '*',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*'
      },
      fadeOut: {
        direction: 'out',
        out: '*',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*'
      },
      shake: {
        shake: true
      },
      slideIn: {
        direction: 'top',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*'
      },
      slideOut: {
        direction: 'top',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*'
      },
      zoomIn: {
        in: '*'
      },
      zoomOut: {
        out: '*'
      }
    };

    this.visibilityStates = {
      expandCollapse: true,
      fadeIn: {
        in: true,
        top: true,
        bottom: true,
        left: true,
        right: true
      },
      fadeOut: {
        out: true,
        top: true,
        bottom: true,
        left: true,
        right: true
      },
      shake: {
        shake: true
      },
      slideIn: {
        top: true,
        bottom: true,
        left: true,
        right: true
      },
      slideOut: {
        top: true,
        bottom: true,
        left: true,
        right: true
      },
      zoomIn: {
        in: true
      },
      zoomOut: {
        out: true
      }
    };
  }

  ngOnInit(): void {
    this.getZones();
  }

  /**
     * @description: Obtengo las flotas y vehiculosdel cliente
     */
  private getZones(): void {
    this.subscription = this.mapService
      .getZones()
      .subscribe((data) => {
        console.log(data)
      });
  }

}
