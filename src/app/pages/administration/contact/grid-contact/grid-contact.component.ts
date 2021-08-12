import { Component, OnInit } from '@angular/core';
import { contactData } from 'app/core/interfaces/contact';
import { ContactService } from 'app/core/services/contact.service';

@Component({
  selector: 'app-grid-contact',
  templateUrl: './grid-contact.component.html',
  styleUrls: ['./grid-contact.component.scss'],
})
export class GridContactComponent implements OnInit {

  contactData: contactData[] = [];

  constructor(private _contactService: ContactService) { }

  ngOnInit(): void {
    this.fetchContact();
  }

  fetchContact(){
    this._contactService.getContact().subscribe((data:any) =>{
      this.contactData = data.data;
    })
  }

}
