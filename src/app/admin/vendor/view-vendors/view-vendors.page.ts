import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, ElementRef, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar } from '@ionic/angular';

import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { filter, tap, catchError } from 'rxjs/operators';
import { Vendor } from 'src/app/models/Vendor';
import { VendorEditDialogComponent } from 'src/app/components/vendors/vendor-edit-dialog/vendor-edit-dialog.component';

import { LoadingService } from 'src/app/components/loading/loading.service';
import { MessagesService } from '../../../components/messages/messages.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { User } from "../../../models/User";
import { VendorAddDialogComponent } from 'src/app/components/vendors/vendor-add-dialog/vendor-add-dialog.component';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.page.html',
  styleUrls: ['./view-vendors.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewVendorsPage implements OnInit {

  center_id: any;
  resultList: any;

  pageLength: any;
  isTableHasData = true;

  userdata$: Observable<User>;

  ready = 0; // flag check - centerid (localstorage) & customerid (param)

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  displayedColumns: string[] = ['name', 'address1', 'actions'];
  dataSource = new MatTableDataSource<Vendor>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

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
        this.reloadVendors();
        this._cdr.markForCheck();
      });

    this._route.params.subscribe(params => {
      this.init();
    });

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  init() {
    if (this.ready === 1) {  // ready = 1 only after userdata observable returns 
      this.reloadVendors();
    }
  }

  reloadVendors() {

    this._commonApiService.getAllActiveVendors(this.center_id)
      .subscribe((data: any) => {

        // DnD - code to add a "key/Value" in every object of array
        this.dataSource.data = data.map(el => {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          return o;
        })

        this.dataSource.sort = this.sort;
        this.pageLength = data.length;

      });

    this._cdr.markForCheck();
  }

  addVendor() {
    this._router.navigate([`/home/vendor/add`]);
  }


  edit(vendor: Vendor) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = vendor;


    const dialogRef = this._dialog.open(VendorEditDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.reloadVendors();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }



  add() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";

    const dialogRef = this._dialog.open(VendorAddDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.reloadVendors();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


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

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }

}


