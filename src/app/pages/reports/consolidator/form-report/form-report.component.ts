/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MobileService } from '../../../../core/services/mobile.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistoriesService } from '../../../../core/services/histories.service';
import moment from 'moment';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit {
  @Output() emitCloseForm = new EventEmitter<void>();
  @ViewChild('allSelectedMobiles') private allSelectedMobiles: MatOption;
  public form: FormGroup = this.formBuilder.group({});
  public subcription$: Subscription;
  public editMode: boolean = false;
  public mobiles: any[] = [];

  constructor(
    private _mobileService: MobileService,
    private _historicService: HistoriesService,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.subcription$ = this._mobileService.getMobiles().subscribe(({ data }) =>
      this.mobiles = [...data]
    );
  }

  public onSubmit(): void {

    const formValues = this.form.value;
    const dateStart = new Date(formValues.date_init).getTime();
    const dateEnd = new Date(formValues.date_end).getTime();

    if (Number((dateStart - dateEnd) / (1000 * 60 * 60 * 24)) < 91) {
      const converDateInit =
        moment(formValues.date_init).format('DD/MM/YYYY') +
        ' 00:00:00';

      const converDateEnd =
        moment(formValues.date_end).format('DD/MM/YYYY') +
        ' 23:59:00';

      this._historicService.behaviorSubjectDataFormsTrip.next({
        payload: { ...formValues, date_init: converDateInit, date_end: converDateEnd },
      });

      this.editMode = false;
    }
  }

  /**
   * @description: seleccionar muchos de moviles
   */
  allSelectionMobiles(): void {
    if (this.allSelectedMobiles.selected) {
      this.form.controls['plates']
        .patchValue([...this.mobiles.map(item => item.plate), 0]);
    } else {
      this.form.controls['plates'].patchValue([]);
    }
  }

  /**
   * @description: Construimos el formulario
   */
  private buildForm(): void {
    this.form = this.formBuilder.group({
      date_init: [new Date(), [Validators.required]],
      date_end: [new Date(), [Validators.required]],
      plates: [[], [Validators.required]],
    });
  }
}
