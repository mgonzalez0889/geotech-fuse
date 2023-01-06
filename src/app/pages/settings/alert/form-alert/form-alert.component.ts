import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from '@services/api/events.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-alert',
  templateUrl: './form-alert.component.html',
  styleUrls: ['./form-alert.component.scss']
})
export class FormAlertComponent implements OnInit {
  @Input() titleForm: string = 'Crear alerta';
  @Input() dataUpdate: any = null;
  @Output() emitCloseForm = new EventEmitter<void>();
  public editMode: boolean = false;
  public alertFormFirst: FormGroup;
  public alertFormSecond: FormGroup;
  public events: any[] = [];
  public listTrasport: { name: string; text: string }[] = [
    {
      name: 'mobiles',
      text: 'Por vehiculo',
    },
    {
      name: 'fleet',
      text: 'Por grupo',
    },
  ];
  private unsubscribe$ = new Subject<void>();

  constructor(private _formBuilder: FormBuilder, private _eventsService: EventsService) {
    this.buildForms();
  }

  get getStatusAlert(): boolean {
    return this.alertFormFirst.get('statusAlert').value;
  }

  ngOnInit(): void {
    this._eventsService.getEvents()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        ({ data }) => this.events = [...data]
      );
  }

  /**
   * @description: Aciones cuando se cierre el formulario
   */
  public closeForm(): void {
    this.emitCloseForm.emit();
  }

  private buildForms(): void {
    this.alertFormFirst = this._formBuilder.group({
      name: ['', Validators.required],
      color: ['#6B7280', Validators.required],
      statusAlert: [true, Validators.required],
      noticeEmail: [false],
      noticeSms: [false],
      description: ['']
    });
    this.alertFormSecond = this._formBuilder.group({
      events: [[], Validators.required]
    });

  }

}
