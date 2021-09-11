import { Component, OnInit } from '@angular/core';
import {HistoriesService} from "../../../../core/services/histories.service";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-form-assign-mark',
  templateUrl: './form-assign-mark.component.html',
  styleUrls: ['./form-assign-mark.component.scss']
})
export class FormAssignMarkComponent implements OnInit {
  public subscription: Subscription;
  public histories$: Observable<any>;
  public histories: any = [];
  constructor(
      private historyService: HistoriesService
  ) { }

  ngOnInit(): void {
      this.listenObservable();
  }
  /**
   * @description: Selected lista
   */
  public onSelected(event ,data: any): void {
      console.log(event);
      // console.log(data);
      this.historyService.subjectDataSelected.next({payload: data, select: event });
  }

  private listenObservable(): void {
      this.subscription = this.historyService.subjectDataHistories.subscribe(({payload, show}) => {
          if (show) {
              this.histories = payload;
              // this.historyService.subjectDataSelected.next(this.histories);
          }
      });

  }

}
