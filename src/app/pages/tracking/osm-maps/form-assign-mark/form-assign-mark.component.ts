import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HistoriesService} from '../../../../core/services/histories.service';
import {Observable, Subscription} from 'rxjs';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-form-assign-mark',
  templateUrl: './form-assign-mark.component.html',
  styleUrls: ['./form-assign-mark.component.scss']
})
export class FormAssignMarkComponent implements OnInit {
  public subscription: Subscription;
  public histories$: Observable<any>;
  public histories: any = [];
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  public checkModel: boolean = false;
  constructor(
      private historyService: HistoriesService
  ) { }

  ngOnInit(): void {
      this.listenObservable();
  }
  /**
   * @description: Cierra el menu de moviles
   */
  public onShow(): void {
      this.closeMenu.emit(false);
  }
  /**
   * @description: Selected lista
   */
  public onSelected(event: MatCheckbox, data: any): void {
      if (event.checked) {
        this.historyService.subjectDataSelected.next({payload: data, select: event.checked });
      }else {
        this.checkModel = event.checked;
        this.historyService.subjectDataSelected.next({payload: data, select: event.checked });
      }
  }
  /**
  * @description: Escucha el observable subject
  */
  private listenObservable(): void {
      this.subscription = this.historyService.subjectDataHistories.subscribe(({payload, show}) => {
          if (show) {
              this.histories = payload;
          }
      });
  }

}
