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
  @Input() required: boolean = true;
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

  get valueControl(): string {
    return this.form.controls[this.labelControl].value;
  }

  filterList(value: string): void {
    const valueSelects = this.options.data.filter(
      (dataValue: any) =>
        dataValue[this.options.keyView]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    this.optionDataCopy = [...valueSelects];

    if (
      value === '' &&
      (this.valueControl.length !== this.optionDataCopy.length)
    ) {
      this.allSelected.deselect();
    }
  }

  public allSelection(): void {
    if (this.allSelected.selected) {
      this.form.controls[this.labelControl]
        .patchValue([...this.optionDataCopy.map(item => item[this.options.key]), 0]);
    } else {
      this.form.controls[this.labelControl].patchValue([]);
    }
  }

  public openedSelection(): void {
    if (this.valueControl?.length === this.optionDataCopy.length) {
      this.allSelected.select();
    }
  }

  public verifyAll(): void {
    if (this.valueControl?.length !== this.optionDataCopy.length) {
      this.allSelected.deselect();
    }

    if ((this.valueControl?.length + 1) === this.optionDataCopy.length) {
      this.allSelected.select();
    }
  }
}
