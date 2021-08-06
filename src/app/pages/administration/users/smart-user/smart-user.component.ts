import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smart-user',
  templateUrl: './smart-user.component.html',
  styleUrls: ['./smart-user.component.scss']
})
export class SmartUserComponent implements OnInit {
  public show: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  public openForm(): void {
      this.show = true;
  }


}
