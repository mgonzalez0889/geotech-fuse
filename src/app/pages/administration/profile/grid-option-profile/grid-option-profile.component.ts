import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MenuOptionsService} from '../../../../core/services/menu-options.service';
import {Observable, Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {UserProfileOptionsService} from '../../../../core/services/user-profile-options.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OwnersService} from '../../../../core/services/owners.service';
import {ProjectsService} from "../../../../core/services/projects.service";

@Component({
  selector: 'app-grid-option-profile',
  templateUrl: './grid-option-profile.component.html',
  styleUrls: ['./grid-option-profile.component.scss']
})
export class GridOptionProfileComponent implements OnInit {
   // public subscription$: Subscription;
   // displayedColumns: string[] = ['select', 'option_name', 'option_ubication', 'option_read', 'option_create', 'option_update', 'option_delete',];
   // dataSource: any;
   // selection = new SelectionModel<any>(true, []);
   public form: FormGroup;
   public optionsMenu$: Observable<any>;
   public owners$: Observable<any>;
   public projects$: Observable<any>;

    constructor(
        private menuOptionService: MenuOptionsService,
        private userProfileOptionsService: UserProfileOptionsService,
        private _snackBar: MatSnackBar,
        private ownersService: OwnersService,
        private projectsService: ProjectsService,
        private fb: FormBuilder
    ) { }
    ngOnInit(): void {
        this.getOptions();
        this.getOwners();
        this.getProjects();
        this.createForm();
    }
    public onSave(data: any): void {
        // const {}
        if (data) {
            // console.log(data);
            this.saveOptionProfile(data);
        }
    }
    private createForm(): void {
        this.form = this.fb.group({
            option_id: '',
            owner_id: '',
            project_id: '',
            user_profile_id: '1'
        });
    }
  /**
   * @description: Carga todas las opcionesdel menu
   */
  private getOptions(): void {
        this.optionsMenu$ = this.menuOptionService.getMenuOptions();
  }
  private getOwners(): void {
      this.owners$ = this.ownersService.getOwners();
  }
  private getProjects(): void {
      this.projects$ = this.projectsService.getProjects();
  }
  /**
   *
   * @description: Guarda la opcion seleccionada
   */
  private saveOptionProfile(data: any): void {
      this.userProfileOptionsService.postUserProfileOption(data).subscribe(({data, message}) => {
          this._snackBar.open('Opcion agregada', 'CERRAR', {duration: 4000});
          this.userProfileOptionsService.behaviorSubjectUserProfile$.next({isEdit: false});
      });

  }



}
