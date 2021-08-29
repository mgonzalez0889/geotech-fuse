import {Component, OnInit} from '@angular/core';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {MatTableDataSource} from "@angular/material/table";
import {EventsService} from "../../../../core/services/events.service";


@Component({
    selector: 'app-grid-contacs-events',
    templateUrl: './grid-contacs-events.component.html',
    styleUrls: ['./grid-contacs-events.component.scss']
})
export class GridContacsEventsComponent implements OnInit {
    dropdownList = [];
    dropdownSettings: IDropdownSettings;

    constructor( private _eventService: EventsService ) {
    }

    ngOnInit(): void {
        this.dropdownList = [
            this._eventService.getEvents().subscribe((res) => {
            })
        ];

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
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

}
