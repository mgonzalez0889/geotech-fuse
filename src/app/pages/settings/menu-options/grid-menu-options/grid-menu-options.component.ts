import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {MenuOptionsService} from "../../../../core/services/menu-options.service";

@Component({
  selector: 'app-grid-menu-options',
  templateUrl: './grid-menu-options.component.html',
  styleUrls: ['./grid-menu-options.component.scss']
})
export class GridMenuOptionsComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  public options$: Observable<any>;
  public show: boolean = false;
  constructor(
      private menuOptionService: MenuOptionsService
  ) { }

  ngOnInit(): void {
      this.fetchMenuOption();
  }
  /**
   * @description: Abre el formulario menu opcion
   */
  public openForm(): void {
      this.show = true;
  }
  public closeForm(value: boolean): void {
      this.show = value;
  }
  public onEdit(id: number): void {

  }
  /**
   * @description: Elimina una opcion
   */
  public onDelete(id: number): void {

  }
  /**
   * @description: Listado de opciones de menu
   */
  public fetchMenuOption(): void {
      this.options$ = this.menuOptionService.getMenuOptions();
  }

}
