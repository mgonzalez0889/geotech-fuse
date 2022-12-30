import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ToastAlertService } from '@services/toast-alert/toast-alert.service';
import { takeUntil, delay, mergeMap, filter } from 'rxjs/operators';
import { IButtonOptions, IOptionTable, IStateHeaders } from '@interface/index';
import { CommandsService } from '@services/api/commands.service';
import { ConfirmationService } from '@services/confirmation/confirmation.service';

@Component({
  selector: 'app-commands-dashboard',
  templateUrl: './commands-dashboard.component.html',
  styleUrls: ['./commands-dashboard.component.scss'],
})
export class CommandsDashboardComponent implements OnInit, OnDestroy {
  public openedDrawer = false;
  public commandsData: any[] = [];
  public initialDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public finalDate: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  public selectedFleets = [];
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
      console.log(data);

      this.resendCommand(data.plate, data.typecommand_id);
    },
  };
  private unsubscribe$ = new Subject<void>();
  constructor(
    private commandService: CommandsService,
    private translocoService: TranslocoService,
    private toastAlert: ToastAlertService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.getSentCommands();

    const intervallTimer$ = interval(20000);
    intervallTimer$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() =>
        this.getSentCommands()
      );

    this.translocoService.langChanges$
      .pipe(takeUntil(this.unsubscribe$), delay(500))
      .subscribe(() => {
        this.getSentCommands();
      });
  }

  /**
   * @description: Destruye el observable
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * @description: Funcion del filtro en la tabla
   */
  public filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataFilter = filterValue.trim().toLowerCase();
  }

  /**
   * @description: Obtiene los comandos enviados
   */
  public getSentCommands(): void {
    const date = {
      dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
      dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
    };
    this.commandService.postSearchCommandsSend(date)
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

  public sendCommand(commandData: any): void {
    const confirmation = this.confirmationService.open({
      title: this.translocoService.translate('commands.commandAlert.titleAlert'),
      message:
        this.translocoService.translate('commands.commandAlert.messageAlert'),
    });
    confirmation.afterClosed()
      .pipe(
        filter(result => result === 'confirmed'),
        mergeMap(() => this.commandService.postCommandsSend(commandData))
      )
      .subscribe(({ code }) => {
        if (code === 200) {
          this.toastAlert.toasAlertSuccess({
            message: 'commands.commandAlert.successCommand'
          });
        } else {
          this.toastAlert.toasAlertWarn({
            message: 'commands.commandAlert.alertMessageError'
          });
        }
      });
  }

  /**
   * @description: Armar los datos para poder mandar el comando desde la opcion de reenviar
   */
  private resendCommand(plate: any, typeCommand: number): void {
    const commands = {
      validationFleet: 0,
      fleets: this.selectedFleets,
      plates: [plate],
      command: typeCommand,
    };
    this.sendCommand(commands);
  }
}
