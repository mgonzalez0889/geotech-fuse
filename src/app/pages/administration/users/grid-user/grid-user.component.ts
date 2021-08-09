import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable, Subject, Subscription} from "rxjs";
import {UsersService} from "../../../../core/services/users.service";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {debounceTime, switchMap, takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmDeleteComponent} from "../../../../shared/dialogs/confirm-delete/confirm-delete.component";

@Component({
  selector: 'app-grid-user',
  templateUrl: './grid-user.component.html',
  styleUrls: ['./grid-user.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations     : fuseAnimations
})
export class GridUserComponent implements OnInit, OnDestroy {
  searchInputControl: FormControl = new FormControl();
  public users$: Observable<any>;
  public show: boolean = false;
  public subscription$: Subscription;
  constructor(
      private usersService: UsersService,
      public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
      this.fetchUsers();
      this.searchInputControl.valueChanges.subscribe(res => {
          console.log(res);
      })
  }
  /**
   * @description: Abre el formulario
   */
  public openForm(): void {
      this.show = true;
      this.usersService.behaviorSubjectUser$.next({type: 'NEW', isEdit: false});
  }
  public closeForm(value): void {
      this.show = value;
  }
  /**
   * @description: Edita un usuario
   */
  public onEdit(id: number): void {
      this.show = true;
      this.getUser(id);
  }
  public onDelete(id: number): void {
      const dialog = new MatDialogConfig();
      dialog.data = id;
      dialog.width = '30%';
      dialog.maxWidth = '30%';

      const dialogRef = this.dialog.open(ConfirmDeleteComponent, dialog);

      dialogRef.afterClosed().toPromise().then(() => this.fetchUsers());
  }
  /**
   * @description:  Listado de todos los usuarios
   */
  private fetchUsers(): void {
      this.users$ = this.usersService.getUsers();
  }
  /**
   * @description: Trae un usuario desde el services
   */
  private getUser(id: number): void {
      this.usersService.getUser(id).subscribe(({data}) => {
          this.usersService.behaviorSubjectUser$.next({type: 'EDIT', id, isEdit: true, payload: data});
      });
  }
  /**
   * @description: Destruye los observables
   */
  ngOnDestroy(): void {
    // this.subscription$.unsubscribe();
  }



}
