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
    this.showContact();
  }
    /**
     * @description: Mostrar todos los contactos
     */
    public showContact(): void{
    this._contactService.getContacts().subscribe((res: any) =>{
      this.contactData = res.data;
      console.log(res.data);
    });
  }
    /**
     * @description: Eliminar un contacto
     */
    public deleteContact(id: string){
        this._contactService.deleteContacts(id).subscribe(
            res => this._contactService.getContacts().subscribe((data:any) =>{
                this.contactData =data.data;
                console.log('Elemento eliminado');

            })
        );
    }

}
