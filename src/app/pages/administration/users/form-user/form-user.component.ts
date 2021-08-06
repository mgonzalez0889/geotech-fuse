import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ProfilesService} from "../../../../core/services/profiles.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit {
  public form: FormGroup;
  public profile$: Observable<any>;
  constructor(
      private fb: FormBuilder,
      private profileService: ProfilesService
  ) { }

  ngOnInit(): void {
      this.createForm();
      this.getProfile();
  }

  private createForm(): void {
      this.form = this.fb.group({
          user_login: [''],
          password_digest: [''],
          encrypted_password: [''],
          full_name: [''],
          status: [''],
          owner_id: [''],
          user_profile_id: [''],
          email: ['']
      });
  }

  private getProfile(): void {
      this.profile$ = this.profileService.getProfiles();
  }

}
