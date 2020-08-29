import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Observable } from 'rxjs';
import { User } from "../../models/User";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { IonSearchbar } from '@ionic/angular';


@Component({
  selector: 'app-inventory-reports',
  templateUrl: './inventory-reports.page.html',
  styleUrls: ['./inventory-reports.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InventoryReportsPage implements OnInit {


  center_id: any;
  resultList: any;

  pageLength = 0;
  isTableHasData = true;

  userdata$: Observable<User>;
  ready = 0; // flag check - centerid (localstorage) & customerid (param)

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  displayedColumns: string[] = ['description', 'module', 'invoiceno', 'actntype', 'txnqty', 'stocklevel', 'txndate'];
  dataSource = new MatTableDataSource<any>();


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService, private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,) {

    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.center_id = data.center_id;
        this.ready = 1;
        this.reloadInventoryReport();
        this._cdr.markForCheck();
      });

    this._route.params.subscribe(params => {
      this.init();
    });

  }


  init() {
    if (this.ready === 1) {  // ready = 1 only after userdata observable returns 
      this.reloadInventoryReport();
    }
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length > 0) {
      this.isTableHasData = true;
    } else {
      this.isTableHasData = false;
    }

  }

  reset() {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }


  reloadInventoryReport() {

    this._commonApiService.fetchProductInventoryReports(
      { "center_id": this.center_id, "produc_id": "" })
      .subscribe((data: any) => {

        // DnD - code to add a "key/Value" in every object of array
        this.dataSource.data = data.body.map(el => {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          return o;
        })

        this.dataSource.sort = this.sort;
        this.pageLength = data.length;

      });

    this._cdr.markForCheck();
  }


}
