import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../../core/services/users.service';

@Component({
    selector: 'app-grid-user',
    templateUrl: './grid-user.component.html',
    styleUrls: ['./grid-user.component.scss'],
})
export class GridUserComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public subscription: Subscription;
    public opened: boolean = false;
    public dataTableUser: MatTableDataSource<any>;
    public usersCount: number = 0;
    public columnsUser: string[] = [
        'user_login',
        'full_name',
        'profile',
        'email',
    ];

    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this.getUsers();
    }

    /**
     * @description: Destruye los observables
     */
    ngOnDestroy(): void {}
    /**
     * @description: Trae todos los usuarios del cliente
     */
    public getUsers(): void {
        this.usersService.getUsers().subscribe((res) => {
            if (res.data) {
                this.usersCount = res.data.length;
            } else {
                this.usersCount = 0;
            }
            this.dataTableUser = new MatTableDataSource(res.data);
            this.dataTableUser.paginator = this.paginator;
            this.dataTableUser.sort = this.sort;
        });
    }
    /**
     * @description: Filtrar datos de la tabla
     */
    public filterTable(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataTableUser.filter = filterValue.trim().toLowerCase();
    }
}
