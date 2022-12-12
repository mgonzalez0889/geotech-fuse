import { Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent {
  @Input() form: FormGroup;
  @Input() labelControl: string;
  @Input() placeholder: string;
  @Input() options: { data: any[]; key: string; keyView: string } = {
    data: [],
    key: '',
    keyView: ''
  };
  @ViewChild('allSelected') private allSelected: MatOption;
  public valueFilter: string = '';

  constructor() { }

  public allSelection(): void {
    if (this.allSelected.selected) {
      this.form.controls[this.labelControl]
        .patchValue([...this.options.data.map(item => item[this.options.key]), 0]);
    } else {
      this.form.controls[this.labelControl].patchValue([]);
    }
  }
}
