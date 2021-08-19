import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ProfilesService} from "../../../../core/services/profiles.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-grid-profile',
  templateUrl: './grid-profile.component.html',
  styleUrls: ['./grid-profile.component.scss']
})
export class GridProfileComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  public profile$: Observable<any>;
  public show: boolean = false;
  constructor(
      private profileService: ProfilesService,
      private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
      this.fetchProfile();
  }
  /**
   * @description: Abre el formulario perfil
   */
  public openForm(): void {
      this.show = true;
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
      this.show = true;
      this.getProfile(id);
  }
  public onDelete(id: number): void {
      this.deleteProfile(id);
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
