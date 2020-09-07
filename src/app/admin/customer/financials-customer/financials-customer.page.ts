import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from 'src/app/models/Customer';
import { User } from 'src/app/models/User';
import { IonSearchbar } from '@ionic/angular';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { CustomerPaymentDialogComponent } from 'src/app/components/customers/customer-payment-dialog/customer-payment-dialog.component';
import { SuccessMessageDialogComponent } from 'src/app/components/success-message-dialog/success-message-dialog.component';

@Component({
  selector: 'app-financials-customer',
  templateUrl: './financials-customer.page.html',
  styleUrls: ['./financials-customer.page.scss'],
})
export class FinancialsCustomerPage implements OnInit {


  center_id: any;
  customer_id: any;

  // customer$: Observable<Customer[]>;
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

  customerdata: any;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;



  @ViewChild('InvoiceTablePaginator') invoiceTablePaginator: MatPaginator;
  @ViewChild('PaymentTablePaginator') pymtTablePaginator: MatPaginator;
  @ViewChild('LedgerTablePaginator') ledgerTablePaginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  @ViewChild('epltable0', { static: false }) epltable0: ElementRef;

  @ViewChild('epltable1', { static: false }) epltable1: ElementRef;


  // table display columns
  displayedColumns: string[] = ['ledgerdate', 'ledgerrefid', 'type', 'creditamt', 'debitamt', 'balamt'];
  saleInvoiceDisplayedColumns: string[] = ['invoicedate', 'invoiceno', 'nettotal', 'paymentstatus', 'paidamt', 'balamt', 'paybtn'];

  paymentDisplayedColumns: string[] = ['invoiceno', 'invoicedate', 'pymtdate', 'paymentno', 'bankref', 'pymtref', 'paidamt'];

  // data sources
  ledgerdataSource = new MatTableDataSource<any>();
  saleInvoicedataSource = new MatTableDataSource<any>();

  paymentdataSource = new MatTableDataSource<any>();


  tabIndex = 0;

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
        // this.reloadCustomerLedger();
        // this.reloadSaleInvoiceByCustomer();
        // this.reloadPaymentsByCustomer();
        this.init();

        this._cdr.markForCheck();
      });

    this._route.data.subscribe(data => {
      this.customerdata = data['customerdata'][0];
      this.customer_id = this.customerdata.id;

    });


    this._route.params.subscribe(params => {

      this.center_id = params['center_id'];
      this.customer_id = params['customer_id'];

      this._cdr.markForCheck();
      this.init();

    });


  }



  init() {

    if (this.ready === 1 && this.customer_id !== undefined) {

      this.reloadSaleInvoiceByCustomer();
      this.reloadCustomerLedger();
      this.reloadPaymentsByCustomer();
    }
  }

  reloadCustomerLedger() {
    this._commonApiService.getLedgerCustomer(this.center_id, this.customer_id).subscribe(
      (data: any) => {

        // DnD - code to add a "key/Value" in every object of array
        this.ledgerdataSource.data = data.map(el => {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          return o;
        })

        this.ledgerdataSource.sort = this.sort;
        this.pageLength = data.length;
        this._cdr.markForCheck();
      });


  }

  ngOnInit() {


  }

  ngAfterViewInit() {
    this.saleInvoicedataSource.paginator = this.invoiceTablePaginator;
    this.paymentdataSource.paginator = this.pymtTablePaginator;
    this.ledgerdataSource.paginator = this.ledgerTablePaginator;
  }

  async tabClick($event) {

    // Ledger Tab
    if ($event.index === 0) {
      this.reloadSaleInvoiceByCustomer();
    } else if ($event.index === 1) {
      this.reloadPaymentsByCustomer();
    } else if ($event.index === 2) {
      this.reloadCustomerLedger();
    }

    this._cdr.markForCheck();

  }




  reloadSaleInvoiceByCustomer() {

    this._commonApiService.getSaleInvoiceByCustomer(this.center_id, this.customer_id).subscribe(
      (data: any) => {
        // DnD - code to add a "key/Value" in every object of array
        this.saleInvoicedataSource.data = data.map(el => {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          return o;
        })

        this.saleInvoicedataSource.sort = this.sort;
        this.pageLength = data.length;

        this._cdr.markForCheck();

      });

  }

  reloadPaymentsByCustomer() {

    this._commonApiService.getPaymentsByCustomer(this.center_id, this.customer_id).subscribe(
      (data: any) => {
        // DnD - code to add a "key/Value" in every object of array
        this.paymentdataSource.data = data.map(el => {
          var o = Object.assign({}, el);
          o.isExpanded = false;
          return o;
        })

        this.paymentdataSource.sort = this.sort;
        this.pageLength = data.length;

        this._cdr.markForCheck();

      });

  }

  viewAllCustomers() {
    this._router.navigate([`/home/view-customers`]);
  }



  addPayments(element) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = { "customerdata": this.customerdata, "invoicedata": element };

    const dialogRef = this._dialog.open(CustomerPaymentDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {

          this.init();
          this._cdr.markForCheck();
        }
        )
      ).subscribe((data: any) => {

        console.log('object dinesh ');
        if (data === 'success') {

          const dialogConfigSuccess = new MatDialogConfig();
          dialogConfigSuccess.disableClose = false;
          dialogConfigSuccess.autoFocus = true;
          dialogConfigSuccess.width = "25%";
          dialogConfigSuccess.height = "25%";
          dialogConfigSuccess.data = "Add receivables succesful";

          const dialogRef = this._dialog.open(SuccessMessageDialogComponent, dialogConfigSuccess);

        }
      });


  }


}


