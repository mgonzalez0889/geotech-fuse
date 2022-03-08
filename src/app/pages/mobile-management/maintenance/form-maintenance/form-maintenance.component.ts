import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-maintenance',
  templateUrl: './form-maintenance.component.html',
  styleUrls: ['./form-maintenance.component.scss']
})
export class FormMaintenanceComponent implements OnInit {
  public form: FormGroup;
  constructor(
      private fb: FormBuilder
  ) { }

  ngOnInit(): void {
      this.createForm();
  }

  private createForm(): void {
      this.form = this.fb.group({
          sms: this.fb.array([''])
      });
  }

  public addSms(): void {
     this.smsArray.push(this.fb.control(''));
  }

  public removeSms(id: number) {
      this.smsArray.removeAt(id);
  }

  get smsArray(): FormArray {
      return this.form.get('sms') as FormArray;
  }

}
