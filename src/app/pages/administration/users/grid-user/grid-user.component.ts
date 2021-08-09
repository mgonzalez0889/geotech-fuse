import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import {UsersService} from "../../../../core/services/users.service";
import {fuseAnimations} from "../../../../../@fuse/animations";

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
      private usersService: UsersService
  ) { }

  ngOnInit(): void {
      this.fetchUsers();
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
