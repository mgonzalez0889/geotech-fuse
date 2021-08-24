import { Component, OnInit } from '@angular/core';
import {ProfilesService} from "../../../../core/services/profiles.service";
import {Observable, Subscription} from "rxjs";
import {FormControl} from "@angular/forms";
import {UserProfilePlateService} from "../../../../core/services/user-profile-plate.service";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";

@Component({
  selector: 'app-form-plate-option',
  templateUrl: './form-plate-option.component.html',
  styleUrls: ['./form-plate-option.component.scss']
})
export class FormPlateOptionComponent implements OnInit {
  public profile$: Observable<any>;
  public searchInputControl: FormControl = new FormControl();
  public displayedColumns: string[] = ['select', 'plate', 'label'];
  public dataSource: any;
  public subscription: Subscription;
  public selection = new SelectionModel<any>(true, []);
  constructor(
      private profileService: ProfilesService,
      private userProfilePlateService: UserProfilePlateService
  ) { }

  ngOnInit(): void {
      this.getProfiles();
      this.getPlates()
  }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle(): void {
        console.log(this.selection);
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

  /**
   * @description: Trae todos los profiles
   */
  private getProfiles(): void {
      this.profile$ = this.profileService.getProfiles();
  }

  private listenObservables(): void {

  }

  private getPlates(): void {
      this.subscription = this.userProfilePlateService.getUserProfilePlate().subscribe(({data}) => {
          this.dataSource = new MatTableDataSource(data);

      });
  }

}
