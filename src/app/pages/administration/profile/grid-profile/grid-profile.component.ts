import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {ProfilesService} from "../../../../core/services/profiles.service";

@Component({
  selector: 'app-grid-profile',
  templateUrl: './grid-profile.component.html',
  styleUrls: ['./grid-profile.component.scss']
})
export class GridProfileComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  public profile$: Observable<any>;
  public show: boolean;
  constructor(
      private profileService: ProfilesService

  ) { }

  ngOnInit(): void {
      this.fetchProfile();
  }
  /**
   * @description: Abre el formulario perfil
   */
  public openForm(): void {
      this.show = true;
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

  }

}
