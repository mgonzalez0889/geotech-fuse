import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil, filter, mergeMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommandsService } from '@services/api/commands.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MobileService } from '@services/api/mobile.service';
import { FleetsService } from '@services/api/fleets.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';
import { TranslocoService } from '@ngneat/transloco';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-form-commands',
  templateUrl: './form-commands.component.html',
  styleUrls: ['./form-commands.component.scss']
})
export class FormCommandsComponent implements OnInit {
  @Output() emitCloseForm = new EventEmitter<void>();
  public mobilesData: any[] = [];
  public fleetsData: any[] = [];
  public typeCommands: any[] = [];
  public formCommands: FormGroup = this.formBuilder.group({});
  private unsubscribe$ = new Subject<void>();

  constructor(
    private commandService: CommandsService,
    private mobileService: MobileService,
    private fleetService: FleetsService,
    private formBuilder: FormBuilder,
    private translocoService: TranslocoService,
    private confirmationService: ConfirmationService,
    private toastAlert: ToastAlertService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.mobileService.getMobiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.mobilesData = data || [];
      });

    this.fleetService.getFleets()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.fleetsData = data || [];
      });

    this.commandService.getTypeCommands()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.typeCommands = data || [];
      });
  }

  sendCommand(): void {
    const formValue = this.formCommands.value;
  }

  private buildForm(): void {
    this.formCommands = this.formBuilder.group({
      fleets: [[]],
      plates: [[]],
      validationFleet: [0],
      typeCommandId: ['', Validators.required]
    });
  }

}
