import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {UsersService} from "../../../../core/services/users.service";
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
  selector: 'app-grid-user',
  templateUrl: './grid-user.component.html',
  styleUrls: ['./grid-user.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations     : fuseAnimations
})
export class GridUserComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  public users$: Observable<any>;
  public show: boolean = false;
  constructor(
      private usersService: UsersService
  ) { }

  ngOnInit(): void {
      this.fetchUsers();
  }

  public openForm(): void {
      this.show = true;
  }

  private fetchUsers(): void {
      this.users$ = this.usersService.getUsers();
      // this.usersService.getUsers().subscribe(res => console.log(res), error => console.log(error));
  }

}
