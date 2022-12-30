import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input-color',
  templateUrl: './input-color.component.html',
  styleUrls: ['./input-color.component.scss']
})
export class InputColorComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() labelControl: string;
  public colors = ['#6B7280', '#FBBF24', '#F43F5E', '#145D2D', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#1A6FB5'];

  constructor() { }

  ngOnInit(): void {
  }

}
