import { Component, OnInit } from '@angular/core';
import { MobileService } from 'app/core/services/mobile.service';

@Component({
  selector: 'app-floating-menu-detail',
  templateUrl: './floating-menu-detail.component.html',
  styleUrls: ['./floating-menu-detail.component.scss']
})
export class FloatingMenuDetailComponent implements OnInit {
    public selectedState: number = 0;

  constructor(
    ) { }

  ngOnInit(): void {
  }

  onChange($event: any): any {
    this.selectedState = $event.value;
  }

}
