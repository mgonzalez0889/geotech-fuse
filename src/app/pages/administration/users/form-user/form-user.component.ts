import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProfilesService} from "../../../../core/services/profiles.service";
import {Observable, Subscription} from "rxjs";
import {UsersService} from "../../../../core/services/users.service";

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public profile$: Observable<any>;
  public subscription$: Subscription = this.userService.subjectUser$.subscribe(({type, isEdit}) => {
      if (isEdit){
          console.log('Entra');
      }
  });
  constructor(
      private fb: FormBuilder,
      private profileService: ProfilesService,
      private userService: UsersService
  ) { }

  ngOnInit(): void {
      this.createForm();
      this.getProfile();
      this.listenObservables();
  }

  public onSave(): void {
      const data = this.form.getRawValue();
      console.log(data);
      this.newUser(data);
  }

  private createForm(): void {
      this.form = this.fb.group({
          user_login: [''],
          password_digest: [''],
          encrypted_password: [''],
          full_name: [''],
          status: [true],
          owner_id: ['1'],
          user_profile_id: [''],
          email: ['']
      });
  }

  private getProfile(): void {
      this.profile$ = this.profileService.getProfiles();
  }
  private newUser(data: any): void {
      this.userService.postUser(data).subscribe(res => {
          console.log(res);
      });
  }

  private listenObservables(): void {

  }

  ngOnDestroy(): void {
      this.subscription$.unsubscribe();
  }

}
