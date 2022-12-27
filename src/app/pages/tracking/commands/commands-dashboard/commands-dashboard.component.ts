import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommandsService } from 'app/core/services/api/commands.service';
import { FleetsService } from 'app/core/services/api/fleets.service';
import { MobileService } from 'app/core/services/api/mobile.service';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { interval, Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { takeUntil, delay } from 'rxjs/operators';
import { IButtonOptions, IOptionTable, IStateHeaders } from '@interface/index';

@Component({
  selector: 'app-commands-dashboard',
  templateUrl: './commands-dashboard.component.html',
  styleUrls: ['./commands-dashboard.component.scss'],
})
export class CommandsDashboardComponent implements OnInit, OnDestroy {
  public show: boolean;
  public openedDrawer = false;
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public day = this.today.getDate();
  public commandsData: any[] = [];
  public searchPlate: any;
  public searchFleets: any;
  public validationFleet: number = 0;
  public allSelectedMobiles: boolean = false;
  public allSelectedFleets: boolean = false;
  public typeCommands: any;
  public initialDate: Date = new Date(this.year, this.month, this.day);
  public finalDate: Date = new Date(this.year, this.month, this.day);
  public selectedPlates = [];
  public selectedTypeCommand: number;
  public selectedFleets = [];
  public mobiles: any = [];
  public fleets: any = [];
  public intervallTimer = interval(20000);
  public dataFilter: string = '';
  public optionsTable: IOptionTable[] = [
    {
      name: 'plate',
      text: 'commands.tablePage.plate',
      typeField: 'text',
    },
    {
      name: 'date_sent',
      text: 'commands.tablePage.dateOfShipment',
      typeField: 'date',
    },
    {
      name: 'name_command',
      text: 'commands.tablePage.commandType',
      typeField: 'text',
    },
    {
      name: 'user_sent',
      text: 'commands.tablePage.user',
      typeField: 'text',
    },
    {
      name: 'stateName',
      text: 'commands.tablePage.state',
      typeField: 'text',
      classTailwind: 'inline-flex items-center font-bold text-xs px-2.5 py-0.5 rounded-full tracking-wide uppercase leading-relaxed whitespace-nowrap',
      color: (data): string => {
        let colorState = '';
        if (data.state === 'EXPIRADO') {
          data['stateName'] = 'commands.commandStatus.commandExpired';
          colorState = 'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50';
        } else if (data.state === 'CONFIRMADO') {
          data['stateName'] = 'commands.commandStatus.commandcConfirmed';
          colorState = 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-50';
        } else if (data.state === 'PENDIENTE') {
          data['stateName'] = 'commands.commandStatus.commandPending';
          colorState = 'bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-50';
        }
        return colorState;
      }
    },
  ];
  public columnsCommands: string[] = this.optionsTable.map(({ name }) => name).concat('action');;
  public statesHeader: IStateHeaders[] = [
    {
      text: 'commands.pendingStatus',
      numberState: 0,
      styleTailwind: 'bg-blue-200 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
    },
    {
      text: 'commands.stateSent',
      numberState: 0,
      styleTailwind: 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-green-50'
    },
    {
      text: 'commands.statusExpired',
      numberState: 0,
      styleTailwind: 'bg-red-200 text-red-800 dark:bg-red-600 dark:text-red-50'
    }
  ];
  public buttonTableOption: IButtonOptions<any> = {
    icon: 'refresh',
    text: 'commands.tablePage.resendCommand',
    action: (data) => {
      this.resendCommand(data.plate, data.typecommand_id);
    },
  };
  private unsubscribe$ = new Subject<void>();
  constructor(
    private commandsService: CommandsService,
    private mobilesService: MobileService,
    private fleetService: FleetsService,
    private confirmationService: ConfirmationService,
    private translocoService: TranslocoService,
    private toastAlertService: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.getTypeCommand();
    this.getSentCommands();
    this.getFleets();
    this.getMobiles();
    this.intervallTimer
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() =>
        this.getSentCommands()
      );
    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribe$), delay(500))
      .subscribe(() => {
        this.getSentCommands();
        this.getTypeCommand();
      });
  }

  /**
   * @description: Funcion del filtro en la tabla
   */
  filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Armar los datos para poder mandar el comando desde la opcion de reenviar
   */
  public resendCommand(plate: any, typeCommand: number): void {
    const commands = {
      validationFleet: this.validationFleet,
      fleets: this.selectedFleets,
      plates: [plate],
      command: typeCommand,
    };
    this.sendCommandsToDevice(commands);
  }
  /**
   * @description: Armar los datos para poder mandar el comando
   */
  public sentCommands(): void {
    this.selectedPlates = [];
    this.selectedFleets = [];
    this.mobiles.forEach((x) => {
      if (x.selected) {
        this.selectedPlates.push(x.plate);
      }
    });
    this.fleets.forEach((x) => {
      if (x.selected) {
        this.selectedFleets.push(x.id);
      }
    });
    const commands = {
      validationFleet: this.validationFleet,
      fleets: this.selectedFleets,
      plates: this.selectedPlates,
      command: this.selectedTypeCommand,
    };
    this.sendCommandsToDevice(commands);
  }

  /**
   * @description: Funcion valida si estamos enviando comandos a una flota o un vehiculo
   */
  public typeOfSelection(event: any): void {
    this.validationFleet = event.index;
  }
  /**
   * @description: Funcion de seleccionar todo
   */
  public setAll(completed: boolean, type: string): any {
    if (type === 'mobiles') {
      this.allSelectedMobiles = completed;
      if (this.mobiles == null) {
        return;
      }
      this.mobiles.forEach((x) => {
        x.selected = completed;
      });
    } else if ('fleets') {
      this.allSelectedFleets = completed;
      if (this.fleets == null) {
        return;
      }
      this.fleets.forEach(t => (t.selected = completed));
    }
  }
  /**
   * @description: Funcion de validar si esta todo seleccionado
   */
  public someComplete(type: string): boolean {
    if (type === 'mobiles') {
      if (this.mobiles == null) {
        return false;
      }
      return (
        this.mobiles.filter(t => t.selected).length > 0 &&
        !this.allSelectedMobiles
      );
    } else if ('fleets') {
      if (this.fleets == null) {
        return false;
      }
      return (
        this.fleets.filter(t => t.selected).length > 0 &&
        !this.allSelectedFleets
      );
    }
  }
  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Obtiene los comandos enviados
   */
  public getSentCommands(): void {
    const date = {
      dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
      dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
    };
    this.commandsService.postSearchCommandsSend(date)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        if (response.data_count) {
          this.statesHeader[0].numberState = response.data_count[0].count_state || 0;
          this.statesHeader[1].numberState = response.data_count[1].count_state || 0;
          this.statesHeader[2].numberState = response.data_count[2].count_state || 0;
        }
        this.commandsData = response.data || [];
      });
  }

  /**
   * @description: Muestra los tipos de comandos del cliente
   */
  private getTypeCommand(): void {
    this.commandsService.getTypeCommands()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.typeCommands = data.data;
      });
  }
  /**
   * @description: Obtiene los vehiculos del cliente
   */
  private getMobiles(): void {
    this.mobilesService.getMobiles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.mobiles = data?.data?.map((x) => {
          x['selected'] = false;
          return x;
        });
      });
  }
  /**
   * @description: Obtiene las flotas del cliente
   */
  private getFleets(): void {
    this.fleetService.getFleets()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.fleets = data?.data?.map((x) => {
          x['selected'] = false;
          return x;
        });
      });
  }


  /**
   * @description: Funcion de enviar comandos
   */
  private sendCommandsToDevice(commands: any): void {
    if (commands.fleets.length || commands.plates.length) {
      let confirmation = this.confirmationService.open({
        title: this.translocoService.translate('commands.commandAlert.titleAlert'),
        message:
          this.translocoService.translate('commands.commandAlert.messageAlert'),
      });
      confirmation.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.show = true;
          this.commandsService
            .postCommandsSend(commands)
            .subscribe((data) => {
              if (data.code === 200) {
                this.show = false;
                confirmation = this.confirmationService.open({
                  title: this.translocoService.translate('commands.commandAlert.titleAlert'),
                  message: this.translocoService.translate('commands.commandAlert.successCommand'),
                });
              } else {
                confirmation = this.confirmationService.open({
                  title: this.translocoService.translate('commands.commandAlert.titleAlert'),
                  message:
                    this.translocoService.translate('commands.commandAlert.alertMessageError'),
                });
              }
              this.getSentCommands();
            });
        }
      });
    } else {
      this.toastAlertService.toasAlertWarn({
        message: 'commands.commandAlert.alertMessageSelectionError'
      });
    }
  }

}
