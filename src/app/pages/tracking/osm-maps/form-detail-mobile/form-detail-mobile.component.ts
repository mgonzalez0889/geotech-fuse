import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HistoriesService} from "../../../../core/services/histories.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-form-detail-mobile',
  templateUrl: './form-detail-mobile.component.html',
  styleUrls: ['./form-detail-mobile.component.scss']
})
export class FormDetailMobileComponent implements OnInit {
  public data$: Observable<any> = new Observable<any>();
  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor(
      private historiesService: HistoriesService
  ) { }

  ngOnInit(): void {
      this.data$ = this.historiesService.subjectDataSelectedDetail;
  }

  public onClose(): void {
      this.closeMenu.emit(false);
      // this.historiesService.eventShowModal$.next({show: true});

  }

}
