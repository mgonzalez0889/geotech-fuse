import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { HistoriesService } from '../../../../core/services/api/histories.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { fuseAnimations } from "../../../../../@fuse/animations";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-form-assign-mark',
  templateUrl: './form-assign-mark.component.html',
  styleUrls: ['./form-assign-mark.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FormAssignMarkComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  private unsubscribe$: Subject<any> = new Subject<any>();
  public histories$: Observable<any>;
  public histories: any = [];
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  public checkModel: boolean = false;
  public animationStates: any;
  public visibilityStates: any;
  constructor(
    private historyService: HistoriesService
  ) {
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
    this.listenObservable();
  }
  /**
   * @description: Cierra el menu de moviles
   */
  public onShow(): void {
    this.closeMenu.emit(false);
    this.historyService.eventShowModal$.next({ show: true });
    this.historyService.modalShowSelected$.next({ show: true });
  }
  /**
   * @description: Selected lista
   */
  public onSelected(event: MatCheckbox, data: any): void {
    if (event.checked) {
      this.historyService.subjectDataSelected.next({ payload: data, select: event.checked });
    } else {
      this.checkModel = event.checked;
      this.historyService.subjectDataSelected.next({ payload: data, select: event.checked });
    }
  }
  /**
  * @description: Escucha el observable subject
  */
  private listenObservable(): void {
    this.subscription = this.historyService.subjectDataHistories.subscribe(({ payload, show }) => {
      if (show) {
        this.histories = payload;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.historyService.resetValuesDataHistories();
  }

}
