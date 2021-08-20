import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserProfileOptionsService} from '../../../../core/services/user-profile-options.service';
import {Observable, Subscription} from 'rxjs';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {OptionProfileInterface} from '../../../../core/interfaces/option-profile.interface';
import {MenuOptionsService} from "../../../../core/services/menu-options.service";

@Component({
  selector: 'app-grid-user-option-profile',
  templateUrl: './grid-user-option-profile.component.html',
  styleUrls: ['./grid-user-option-profile.component.scss']
})
export class GridUserOptionProfileComponent implements OnInit, OnDestroy {
  public userProfileOp$: Observable<any>;
  public subscription: Subscription;
  constructor(
      private userProfileOptionsService: UserProfileOptionsService,
      private menuOptionService: MenuOptionsService
  ) { }

  ngOnInit(): void {
      this.getUserProfileOption();
      this.listenObservable();
  }
  /**
   * @description: Guarda la opcion leer
   */
  public onSaveRead(event: MatCheckboxChange, data: OptionProfileInterface): void {
      if (event.checked) {
          data.option_read = 1;
          this.saveOptionRead(data);
      }else {
          data.option_read = 0;
          this.saveOptionRead(data);
      }
  }
  /**
   * @description: Guarda la opcion crear
   */
  public onSaveCreate(event: MatCheckboxChange, data: OptionProfileInterface): void {
      if (event.checked) {
          data.option_create = 1;
          this.saveOptionCreate(data);
      }else {
          data.option_create = 0;
          this.saveOptionCreate(data);
      }
  }
  /**
   * @description: Guarda la opcion actualizar
   */
  public onSaveUpdate(event: MatCheckboxChange, data: OptionProfileInterface): void {
      if (event.checked) {
          data.option_update = 1;
          this.saveOptionUpdate(data);
      }else {
          data.option_update = 0;
          this.saveOptionUpdate(data);
      }
  }
  /**
   * @description: Guarda la opcion eliminar
   */
  public onSaveDelete(event: MatCheckboxChange, data: OptionProfileInterface): void {
      if (event.checked) {
          data.option_delete = 1;
          this.saveOptionDelete(data);
      }else {
          data.option_delete = 0;
          this.saveOptionDelete(data);
      }
  }
  /**
   * @description: Trae todos los perfiles de usuario
   */
  private getUserProfileOption(): void {
      this.userProfileOp$ = this.userProfileOptionsService.getUserOptionProfile();
  }
  /**
   * @description: Guarda la opcion ver
   */
  private saveOptionRead(data): void {
      this.userProfileOptionsService.putUserProfileOption(data).subscribe((res) => {
          this.userProfileOptionsService.behaviorSubjectUserProfile$.next({isEdit: true});
      });
  }
  /**
   * @description: Guarda la opcion crear
   */
  private saveOptionCreate(data): void {
      this.userProfileOptionsService.putUserProfileOption(data).subscribe((res) => {
          this.userProfileOptionsService.behaviorSubjectUserProfile$.next({isEdit: true});
      });
  }
  /**
   * @description: Guarda la opcion actualizar
   */
  private saveOptionUpdate(data): void {
      this.userProfileOptionsService.putUserProfileOption(data).subscribe((res) => {
          this.userProfileOptionsService.behaviorSubjectUserProfile$.next({isEdit: true});
      });
  }
  /**
   * @description: Guarda la opcion eliminar
   */
  private saveOptionDelete(data): void {
      this.userProfileOptionsService.putUserProfileOption(data).subscribe((res) => {
          this.userProfileOptionsService.behaviorSubjectUserProfile$.next({isEdit: true});
      });
  }
  /**
   * @description: Escucha el observable Behavior para
   */
  private listenObservable(): void {
      this.subscription = this.menuOptionService.behaviorSelectedMenuOption$.subscribe(({id}) => {
          console.log(id);
      })
      this.subscription = this.userProfileOptionsService.behaviorSubjectUserProfile$.subscribe(({isEdit,}) => {
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

  ngOnDestroy(): void {
     this.subscription.unsubscribe();
  }


}
