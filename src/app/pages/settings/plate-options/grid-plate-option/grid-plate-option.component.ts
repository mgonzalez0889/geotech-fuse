import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserProfilePlateService} from "../../../../core/services/user-profile-plate.service";

@Component({
  selector: 'app-grid-plate-option',
  templateUrl: './grid-plate-option.component.html',
  styleUrls: ['./grid-plate-option.component.scss']
})
export class GridPlateOptionComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  displayedColumns: string[] = ['owner_plate_id', 'user_profile_id', 'actions'];
  dataSource: any = [];
  public subscription: Subscription;
  public show: boolean = false;
  constructor(
      private userProfilePlateService: UserProfilePlateService
  ) { }

  ngOnInit(): void {
      this.getPlateOptions();
  }
  /**
   * @description:
   */
  public openForm(): void {
      this.show = true;
      this.userProfilePlateService.behaviorSubjectUserProfilePlate$.next({type: 'NEW', isEdit: false});
  }
  /**
   * @description: Cierra el formulario
   */
  public closeForm(value): void {
      this.show = false;
  }

  private getPlateOptions(): void {
      // this.subscription = this.userProfilePlateService.getUserProfilePlate()

  }

}
