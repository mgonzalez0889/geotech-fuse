import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {HistoriesService} from "../../../../core/services/histories.service";
import {Observable} from "rxjs";
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
  selector: 'app-form-detail-mobile',
  templateUrl: './form-detail-mobile.component.html',
  styleUrls: ['./form-detail-mobile.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations:   fuseAnimations
})
export class FormDetailMobileComponent implements OnInit {
  public data$: Observable<any> = new Observable<any>();
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  public animationStates: any;
  public visibilityStates: any;
  constructor(
      private historiesService: HistoriesService
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
      this.data$ = this.historiesService.subjectDataSelectedDetail;
  }

  public onClose(): void {
      this.closeMenu.emit(false);
      this.historiesService.modalShowSelected$.next({show: true});
  }

}
