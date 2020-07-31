import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar } from '@ionic/angular';

import { Customer } from 'src/app/models/Customer';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { User } from 'src/app/models/User';
import { filter, tap, catchError } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import * as xlsx from 'xlsx';
import { CustomerAddDialogComponent } from 'src/app/components/customers/customer-add-dialog/customer-add-dialog.component';
import { CustomerEditDialogComponent } from 'src/app/components/customers/customer-edit-dialog/customer-edit-dialog.component';
import { CustomerEditShippingAddressComponent } from 'src/app/components/customers/customer-edit-shipping-address/customer-edit-shipping-address.component';


@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.page.html',
  styleUrls: ['./view-customer.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCustomerPage implements OnInit {

  center_id: any;
  customer$: Observable<Customer[]>;
  userdata$: Observable<User>;
  userdata: any;
  isTableHasData = true;

  ready = 0;
  pcount: any;
  noMatch: any;
  responseMsg: string;
  pageLength: any;

  resultsize = 0;
  customerslist: any;
  customersOriglist: any;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;


  displayedColumns: string[] = ['name', 'address1', 'actions'];
  dataSource = new MatTableDataSource<Customer>();

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _dialog: MatDialog,
    private _commonApiService: CommonApiService, private _route: ActivatedRoute,
    private _router: Router,) {

    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.center_id = data.center_id;
        this.ready = 1;
        this.reloadCustomers();
        this._cdr.markForCheck();
      });

    this._route.params.subscribe(params => {
      this.init();
    });


  }

  init() {
    if (this.ready === 1) { this.reloadCustomers(); }
  }

  reloadCustomers() {

    this._commonApiService.getAllActiveCustomers(this.center_id).subscribe(
      (data: any) => {
        // DnD - code to add a "key/Value" in every object of array
        this.dataSource.data = data.map(el => {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          return o;
        })

        this.dataSource.sort = this.sort;
        this.pageLength = data.length;

      });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

  }



  add() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";

    const dialogRef = this._dialog.open(CustomerAddDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.reloadCustomers();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }


  edit(customer: Customer) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = customer;


    const dialogRef = this._dialog.open(CustomerEditDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.reloadCustomers();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }



  editShippingAddress(customer: Customer) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = customer;


    const dialogRef = this._dialog.open(CustomerEditShippingAddressComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.reloadCustomers();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }




  // setupDiscount(item) {
  //   this._router.navigate([`/home/customer/save-discount/${item.id}`]);
  // }

  reset() {
    this.searchbar.value = '';
    this.resultsize = 0;
    this.customerslist = null;
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

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }


}

