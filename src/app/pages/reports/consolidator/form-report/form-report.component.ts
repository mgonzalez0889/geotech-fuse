import moment from 'moment';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MobileService } from '@services/api/mobile.service';
import { HistoriesService } from '@services/api/histories.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-report',
  templateUrl: './form-report.component.html',
  styleUrls: ['./form-report.component.scss'],
})
export class FormReportComponent implements OnInit, OnDestroy {
  @Output() emitCloseForm = new EventEmitter<void>();
  public form: FormGroup = this.formBuilder.group({});
  public subcription$: Subscription;
  public editMode: boolean = false;
  public mobiles: any[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    private _mobileService: MobileService,
    private _historicService: HistoriesService,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.subcription$ = this._mobileService.selectState(state => state.mobiles)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data =>
        this.mobiles = [...data]
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
