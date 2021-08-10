import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-grid-menu-options',
  templateUrl: './grid-menu-options.component.html',
  styleUrls: ['./grid-menu-options.component.scss']
})
export class GridMenuOptionsComponent implements OnInit {
  searchInputControl: FormControl = new FormControl();
  public show: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  /**
   * @description: Abre el formulario menu opcion
   */
  public openForm(): void {
      this.show = true;
  }

}
