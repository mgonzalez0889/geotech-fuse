import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SelectionModel} from "@angular/cdk/collections";
import {MobileService} from "../../../../core/services/mobile.service";
import {Subscription} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  animations:   fuseAnimations

})
export class FloatingMenuComponent implements OnInit {
  @Output() sendMarker: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendDataDevice: EventEmitter<any> = new EventEmitter<any>();
  public displayedColumns: string[] = ['select', 'name', 'lat'];
  public dataSource: any = [];
  public items: any = [];
  public selection = new SelectionModel<any>(true, []);
  public subscription: Subscription;
  public showMenu: boolean = true;
  public showReport: boolean = true;
  constructor(
      private mobilesService: MobileService
  ) { }

  ngOnInit(): void {
      this.getMobiles();
  }

  public onShowMenu(): void {
      this.showMenu = !this.showMenu;
  }

    /** Whether the number of selected elements matches the total number of rows. */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    public masterToggle(): void {
        console.log(this.selection);
        this.isAllSelected() ? this.selection.clear() :
            this.dataSource.data.forEach(row => {
                this.selection.select(row);
            });

        if (this.selection.selected.length){
            this.items.map(x => {
                x['selected'] = true;
                return x;
            });
        }else {
            this.items.map(x => {
                x['selected'] = false;
                return x;
            });
        }

        this.sendMarker.emit(this.items);

    }

    public individual(event, value): void {
        console.log(this.selection);
        console.log(event);
        console.log(value);
        this.items.map(function(x){
            if (x.id == value.id){
                x.selected = event;
            }
            return x;
        });

        const dataSelected = [];
        const dataDeselect = [];

        if (value.selected) {

            dataSelected.push(value);
            console.log(dataSelected);
            this.sendMarker.emit(dataSelected);
            // const seleccionados = this.items.filter(x => x.selected);
            // console.log(seleccionados);
        }else {
            dataDeselect.push(value);
            console.log(dataDeselect);
            this.sendMarker.emit(dataDeselect);
        }
  }

  private getMobiles(): void {
      this.subscription = this.mobilesService.getMobiles().subscribe(({data}) => {
            this.items = data;
            this.dataSource = new MatTableDataSource(data);
            console.log(data);
            this.items.map(x => {
                x['selected'] = false;
                x['individual'] = false;
                return x;
            });
            // this.sendDataDevice.emit(this.items);
      });
  }


}
