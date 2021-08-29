import {Component, OnInit} from '@angular/core';

import {EventsService} from "../../../../core/services/events.service";
import {ContactService} from "../../../../core/services/contact.service";


@Component({
    selector: 'app-grid-contacs-events',
    templateUrl: './grid-contacs-events.component.html',
    styleUrls: ['./grid-contacs-events.component.scss']
})
export class GridContacsEventsComponent implements OnInit {
    dropdownList = [];
    dropdownSettings = {};

    constructor(
        private _eventService: EventsService,
        private _contacsService: ContactService
    ) {
    }

    ngOnInit(): void {
        this.dataCotact();

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Descmarcar seleccion',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
    }

    onItemSelect(item: any) {
        console.log(item);
    }

    onSelectAll(items: any) {
        console.log(items);
    }

    dataCotact(): void {
        const tmp = [];
        this._contacsService.getContacts().subscribe((data) => {
             //console.log(data);
            for (let i = 0; i < data.data.length; i++) {
                //console.log(data.data);
                  tmp.push({item_id: i, item_text: data.data[i].full_name});
            }
            return this.dropdownList = tmp;

            console.log(this.dropdownList);

        });

    }

}
