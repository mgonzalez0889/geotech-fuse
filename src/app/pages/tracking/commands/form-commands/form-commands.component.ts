import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-commands',
  templateUrl: './form-commands.component.html',
  styleUrls: ['./form-commands.component.scss']
})
export class FormCommandsComponent implements OnInit {
  @Output() emitCloseForm = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
