/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommandsService } from 'app/core/services/api/commands.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FleetsService } from 'app/core/services/api/fleets.service';
import { MobileService } from 'app/core/services/api/mobile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'app/core/services/confirmation/confirmation.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-commands-dashboard',
  templateUrl: './commands-dashboard.component.html',
  styleUrls: ['./commands-dashboard.component.scss'],
})
export class CommandsDashboardComponent implements OnInit, OnDestroy {
  public show: boolean;
  public today = new Date();
  public month = this.today.getMonth();
  public year = this.today.getFullYear();
  public day = this.today.getDate();
  public dataCommandsSent: MatTableDataSource<any>;
  public send: number = 0;
  public expired: number = 0;
  public pending: number = 0;
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
  public subscription: Subscription;
  public intervallTimer = interval(20000);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public columnsCommands: string[] = [
    'plate',
    'date_sent',
    'type_command',
    'user',
    'state',
    'resend',
  ];

  constructor(
    private commandsService: CommandsService,
    private mobilesService: MobileService,
    private fleetService: FleetsService,
    private snackBar: MatSnackBar,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.getTypeCommand();
    this.getSentCommands();
    this.getFleets();
    this.getMobiles();
    this.subscription = this.intervallTimer.subscribe(() =>
      this.getSentCommands()
    );
  }

  /**
   * @description: Muestra los tipos de comandos del cliente
   */
  private getTypeCommand(): void {
    this.commandsService.getTypeCommands().subscribe((data) => {
      this.typeCommands = data.data;
    });
  }
  /**
   * @description: Obtiene los comandos enviados
   */
  public getSentCommands(): void {
    const date = {
      dateInit: this.initialDate.toLocaleDateString() + ' 00:00:00',
      dateEnd: this.finalDate.toLocaleDateString() + ' 23:59:59',
    };
    this.commandsService.postSearchCommandsSend(date).subscribe((res) => {
      if (res.data_count) {
        this.send = res.data_count[1]?.count_state;
        this.expired = res.data_count[2]?.count_state;
        this.pending = res.data_count[0]?.count_state;
      } else {
        this.send = 0;
        this.expired = 0;
        this.pending = 0;
      }
      this.dataCommandsSent = new MatTableDataSource(res.data);
      this.dataCommandsSent.paginator = this.paginator;
      this.dataCommandsSent.sort = this.sort;
    });
  }
  /**
   * @description: Obtiene los vehiculos del cliente
   */
  private getMobiles(): void {
    this.mobilesService.getMobiles().subscribe((data) => {
      this.mobiles = data.data.map((x) => {
        x['selected'] = false;
        return x;
      });
    });
  }
  /**
   * @description: Obtiene las flotas del cliente
   */
  private getFleets(): void {
    this.fleetService.getFleets().subscribe((data) => {
      this.fleets = data.data.map((x) => {
        x['selected'] = false;
        return x;
      });
    });
  }
  /**
   * @description: Funcion del filtro en la tabla
   */

  filterTable(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataCommandsSent.filter = filterValue.trim().toLowerCase();
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
   * @description: Funcion de enviar comandos
   */
  private sendCommandsToDevice(commands: any): void {
    if (commands.fleets.length || commands.plates.length) {
      let confirmation = this.confirmationService.open({
        title: 'Enviar comando',
        message:
          '¿Está seguro de que desea enviar este comando? ¡Esta acción no se puede deshacer!',
        actions: {
          confirm: {
            label: 'Enviar',
          },
        },
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
                  title: 'Enviar comando',
                  message: 'Comando enviado con exito!',
                  actions: {
                    cancel: {
                      label: 'Aceptar',
                    },
                    confirm: {
                      show: false,
                    },
                  },
                  icon: {
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                  },
                });
              } else {
                confirmation = this.confirmationService.open({
                  title: 'Enviar comando',
                  message:
                    'El comando no se pudo enviar, favor intente nuevamente!',
                  actions: {
                    cancel: {
                      label: 'Aceptar',
                    },
                    confirm: {
                      show: false,
                    },
                  },
                  icon: {
                    name: 'heroicons_outline:exclamation',
                    color: 'warn',
                  },
                });
              }
              this.getSentCommands();
            });
        }
      });
    } else {
      this.snackBar.open(
        'Favor seleccione un Vehículo o una flota.',
        'CERRAR',
        { duration: 4000 }
      );
    }
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
    this.subscription.unsubscribe();
  }
}
