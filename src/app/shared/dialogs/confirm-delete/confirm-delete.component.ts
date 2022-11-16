import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../../core/services/api/users.service';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialogRef<ConfirmDeleteComponent>,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
  }

  public delete(): void {
    this.userService.deleteUser(this.data).toPromise()
      .then(() => this.closeDialog())
      .then(() =>
        this.snackBar.open(
          'Usuario eliminado',
          'CERRAR',
          { duration: 4000 })
      );
  }

  public closeDialog(): void {
    this.dialog.close();
  }

}
