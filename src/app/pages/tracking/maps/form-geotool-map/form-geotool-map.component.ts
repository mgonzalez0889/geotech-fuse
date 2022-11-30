import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-geotool-map',
  templateUrl: './form-geotool-map.component.html',
  styleUrls: ['./form-geotool-map.component.scss']
})
export class FormGeotoolMapComponent implements OnInit {
  @Input() titleForm: string = '';
  @Output() closeForm = new EventEmitter<boolean>();
  public formGeotool: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.formGeotool = this.fb.group({
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      shape: ['', [Validators.required]],
      diameter: [0, [Validators.required]],
    });
  }
}
