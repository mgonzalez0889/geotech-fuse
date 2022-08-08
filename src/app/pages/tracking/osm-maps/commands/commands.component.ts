import { Component, OnInit } from '@angular/core';
import { CommandsService } from 'app/core/services/commands.service';
import { MapFunctionalitieService } from 'app/core/services/maps/map.service';
import { MobilesService } from 'app/core/services/mobiles/mobiles.service';
import moment from 'moment';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss']
})
export class CommandsComponent implements OnInit {

  public typeCommands: any;
  public selectedTypeCommand: number;
  dataCommandsSent: any;

  constructor(
    public mapFunctionalitieService: MapFunctionalitieService,
    private commandsService: CommandsService,
    public mobileRequestService: MobilesService
  ) { }

  ngOnInit(): void {
    this.getTypeCommand();
    // setInterval(() => {
    //   this.mapFunctionalitieService.goCommands(this.mapFunctionalitieService.plate);
    // }, 50000);
  }

  /**
     * @description: Muestra los tipos de comandos
     */
  getTypeCommand(): void {
    this.commandsService.getTypeCommands().subscribe((data) => {
      this.typeCommands = data.data;
    });
  }

  public sentCommands(): void {
    const commands = {
      plates: [this.mapFunctionalitieService.plate],
      command: this.selectedTypeCommand,
    };
    this.commandsService.postCommandsSend(commands).subscribe((data) => {
      this.mapFunctionalitieService.goCommands(this.mapFunctionalitieService.plate);
    });
  }

  convertDate(date) {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  }


}
