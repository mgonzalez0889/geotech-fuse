import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommandsService } from '@services/api/commands.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MobileService } from '@services/api/mobile.service';
import { FleetsService } from '@services/api/fleets.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-form-commands',
  templateUrl: './form-commands.component.html',
  styleUrls: ['./form-commands.component.scss']
})
export class FormCommandsComponent implements OnInit {
  @Output() emitCloseForm = new EventEmitter<void>();
  @Output() sendDataForm = new EventEmitter<{ commandData: any }>();
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

  public sendCommand(): void {
    const formValue = this.formCommands.value;
    this.sendDataForm.emit({ commandData: formValue });
    this.emitCloseForm.emit();
  }

  public selectTab({ index }: MatTabChangeEvent): void {
    if (index === 0) {
      this.formCommands.controls['fleets'].patchValue([]);
      this.formCommands.controls['fleets'].clearValidators();
      this.formCommands.controls['plates'].setValidators([Validators.required]);
    } else if (index === 1) {
      this.formCommands.controls['plates'].patchValue([]);
      this.formCommands.controls['plates'].clearValidators();
      this.formCommands.controls['fleets'].setValidators([Validators.required]);
    }
    this.formCommands.controls['validationFleet'].patchValue(index);
    this.formCommands.controls['plates'].updateValueAndValidity();
    this.formCommands.controls['fleets'].updateValueAndValidity();
  }

  private buildForm(): void {
    this.formCommands = this.formBuilder.group({
      fleets: [[], Validators.required],
      plates: [[], Validators.required],
      validationFleet: [0],
      typeCommandId: ['', Validators.required]
    });
    this.selectTab({ index: 0 } as MatTabChangeEvent);
  }

}
