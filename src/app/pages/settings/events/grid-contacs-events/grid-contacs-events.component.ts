import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-grid-contacs-events',
  templateUrl: './grid-contacs-events.component.html',
  styleUrls: ['./grid-contacs-events.component.scss']
})
export class GridContacsEventsComponent implements OnInit {
  formContacs = new FormControl();
  contacs: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  constructor() { }

  ngOnInit(): void {
  }

  

}
