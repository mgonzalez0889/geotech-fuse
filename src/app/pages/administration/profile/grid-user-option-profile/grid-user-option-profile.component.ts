import { Component, OnInit } from '@angular/core';
import {UserProfileOptionsService} from "../../../../core/services/user-profile-options.service";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-grid-user-option-profile',
  templateUrl: './grid-user-option-profile.component.html',
  styleUrls: ['./grid-user-option-profile.component.scss']
})
export class GridUserOptionProfileComponent implements OnInit {
  public userProfileOp$: Observable<any>;
  public form: FormGroup;
  constructor(
      private userProfileOptionsService: UserProfileOptionsService,
  ) { }

  ngOnInit(): void {
      this.getUserProfileOption();
      this.listenObservable();
  }

  private getUserProfileOption(): void {
      this.userProfileOp$ = this.userProfileOptionsService.getUserOptionProfile();
  }



  private listenObservable(): void {
      this.userProfileOptionsService.behaviorSubjectUserProfile$.subscribe(({isEdit,}) => {
          switch (isEdit) {
              case false :
                  this.getUserProfileOption();
                  break;
              case true :
                  this.getUserProfileOption();
                  break;
          }
      });
  }


}
