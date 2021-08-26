import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {ProfilesService} from "../../../../core/services/profiles.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MenuOptionsService} from "../../../../core/services/menu-options.service";
import {UserProfilePlateService} from "../../../../core/services/user-profile-plate.service";
import {OwnerPlateService} from "../../../../core/services/owner-plate.service";
import {HelperService} from "../../../../core/services/helper.service";
import {DialogAlertEnum} from "../../../../core/interfaces/fuse-confirmation-config";

@Component({
  selector: 'app-grid-profile',
  templateUrl: './grid-profile.component.html',
  styleUrls: ['./grid-profile.component.scss']
})
export class GridProfileComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  public profile$: Observable<any>;
  public show: string = 'PROFILES';
  constructor(
      private profileService: ProfilesService,
      private _snackBar: MatSnackBar,
      private menuOptionService: MenuOptionsService,
      private userProfilePlate: UserProfilePlateService,
      private ownerPlateService: OwnerPlateService,
      private helperService: HelperService
  ) { }

  ngOnInit(): void {
      this.fetchProfile();
  }
  /**
   * @description: Abre el formulario perfil
   */
  public openForm(): void {
      this.show = 'FORM';
      this.profileService.behaviorSubjectProfile$.next({type: 'NEW', isEdit: false});
  }
  /**
   * @description: Cierra el formulario
   */
  public closeForm(value): void {
      this.show = value;
  }
  /**
   * @description: Edita un perfil
   */
  public onEdit(id: number): void {
      this.show = 'FORM';
      this.getProfile(id);
  }
  /**
   * @description:
   */
  public onOptionProfile(id: number): void {
      this.show = 'OPTIONS';
      this.menuOptionService.behaviorSelectedMenuOption$.next({id});
  }
  /**
   * @description: Abre el formulario de plate
   */
  public onFormPlate(id: number): void {
      this.show = 'FORM-PLATE';
      this.ownerPlateService.behaviorSubjectUserOwnerPlate$.next({id});
  }
  public onDelete(id: number): void {
      this.helperService.showDialogAlertOption({
          title: 'Eliminar registro',
          text: '¿Desea eliminar el perfil?',
          type: DialogAlertEnum.question,
          showCancelButton: true,
          textCancelButton: 'No',
          textConfirButton: 'Si'
      }).then(
          (result) => {
              if (result.value) {
                  this.deleteProfile(id);
              }
          }
      );
  }
  /**
   * @description: Listado de perfiles
   */
  private fetchProfile(): void {
      this.profile$ = this.profileService.getProfiles();
  }
  /**
   * @description: Trae un usuario desde el services profile
   */
  private getProfile(id: number): void {
      this.profileService.getProfile(id).subscribe(({data}) => {
          this.profileService.behaviorSubjectProfile$.next({type: 'EDIT', id, isEdit: true, payload: data});
      });
  }
  /**
   * @description: Deshabilita un perfil
   */
  private deleteProfile(id: number): void {
      this.profileService.deleteProfile(id).subscribe(({data}) => {
          this._snackBar.open('Perfil eliminado con exito', '', {duration: 4000});
      });
  }
}
