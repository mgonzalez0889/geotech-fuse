import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {MenuOptionsService} from '../../../../core/services/menu-options.service';
import {Observable, Subscription} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UserProfileOptionsService} from '../../../../core/services/user-profile-options.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {OwnersService} from '../../../../core/services/owners.service';
import {ProjectsService} from "../../../../core/services/projects.service";
import {MatSelectChange} from "@angular/material/select";
import {OptionCreateInterface, OptionProfileInterface} from "../../../../core/interfaces/option-profile.interface";
import {ProfilesService} from "../../../../core/services/profiles.service";
import {HelperService} from "../../../../core/services/helper.service";
import {DialogAlertEnum} from "../../../../core/interfaces/fuse-confirmation-config";

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
   @Output() onShow: EventEmitter<string> = new EventEmitter<string>();
   public form: FormGroup;
   public optionsMenu$: Observable<any>;
   public owners$: Observable<any>;
   public projects$: Observable<any>;
   // public idProject: number;
   // public idOwner: number;
   public profile$: Observable<any>;
   // public idProfile: number;
    public profile: string = '';

    constructor(
        private menuOptionService: MenuOptionsService,
        private userProfileOptionsService: UserProfileOptionsService,
        private _snackBar: MatSnackBar,
        private ownersService: OwnersService,
        private projectsService: ProjectsService,
        private fb: FormBuilder,
        private profileService: ProfilesService,
        private helperService: HelperService
    ) { }
    ngOnInit(): void {
        this.getOptions();
        this.getOwners();
        this.getProjects();
        this.createForm();
        this.listenObservables();
    }
    public onSave(data: OptionProfileInterface): void {
        this.form.controls.option_id.setValue(data.id);
        const values: OptionCreateInterface  = this.form.getRawValue();
        if (values) {
            this.helperService.showDialogAlertOption({
                title: 'Guardar registro',
                text: '¿Desea guardar la opcion?',
                type: DialogAlertEnum.question,
                showCancelButton: true,
                textCancelButton: 'No',
                textConfirButton: 'Si'
            }).then(
                (result) => {
                    if (result.value) {
                        this.saveOptionProfile(values);
                    }
                }
            );
        }
    }
    /**
     * @description: Cierra el formulario
     */
    public onClose(): void {
        this.onShow.emit('PROFILES');
    }
    /**
     * @description: Crea el formulario
     */
    private createForm(): void {
        this.form = this.fb.group({
            option_id: '',
            owner_id: '',
            project_id: '',
            user_profile_id: ''
        });
    }
  /**
   * @description: Carga todas las opcionesdel menu
   */
  private getOptions(): void {
        this.optionsMenu$ = this.menuOptionService.getMenuOptionsSons();
  }
  private getOwners(): void {
      this.owners$ = this.ownersService.getOwners();
  }
  private getProjects(): void {
      this.projects$ = this.projectsService.getProjects();
  }
  /**
   * @description: Listado de perfiles
   */
  private fetchProfile(id: number): void {
      this.profile$ = this.profileService.getProfile(id);
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
  /**
   * @description: Escucha el observable behavior seleccio
   */
  private listenObservables(): void {
      this.menuOptionService.behaviorSelectedMenuOption$.subscribe(({id, payload}) => {
          // this.fetchProfile(id);
          this.profile = payload.name;
          this.form.controls.user_profile_id.setValue(id);
      });
  }
}
