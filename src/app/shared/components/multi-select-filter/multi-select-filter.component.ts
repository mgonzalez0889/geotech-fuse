import { Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() labelControl: string;
  @Input() placeholder: string;
  @Input() options: { data: any[]; key: string; keyView: string } = {
    data: [],
    key: '',
    keyView: ''
  };
  @ViewChild('allSelected') private allSelected: MatOption;
  public optionDataCopy: any[] = [];
  public valueFilter: string = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.optionDataCopy = [...this.options.data];
  }

  filterList(value: string): void {
    const valueSelects = this.options.data.filter(
      (dataValue: any) =>
        dataValue[this.options.key]
          .toLowerCase()
          .includes(value.toLowerCase())
    );
    this.optionDataCopy = [...valueSelects];
  }

  public allSelection(): void {
    if (this.allSelected.selected) {
      this.form.controls[this.labelControl]
        .patchValue([...this.optionDataCopy.map(item => item[this.options.key]), 0]);
    } else {
      this.form.controls[this.labelControl].patchValue([]);
    }
  }
}
