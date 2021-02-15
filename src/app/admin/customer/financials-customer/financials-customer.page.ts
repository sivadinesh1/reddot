import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	ChangeDetectorRef,
} from '@angular/core';
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
	totalOutstandingBalance = 0;

	customer_credit_amount = 0;

	@ViewChild('searchbartab1', { static: true }) searchbartab1: IonSearchbar;
	@ViewChild('searchbartab2', { static: true }) searchbartab2: IonSearchbar;
	@ViewChild('searchbartab3', { static: true }) searchbartab3: IonSearchbar;
	@ViewChild('searchbartab4', { static: true }) searchbartab4: IonSearchbar;

	@ViewChild('InvoiceTablePaginator') invoiceTablePaginator: MatPaginator;
	@ViewChild('PaymentTablePaginator') pymtTablePaginator: MatPaginator;
	@ViewChild('LedgerTablePaginator') ledgerTablePaginator: MatPaginator;

	@ViewChild('PymtTransactionTablePaginator')
	pymttransactionTablePaginator: MatPaginator;

	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild('epltable', { static: false }) epltable: ElementRef;

	@ViewChild('epltable0', { static: false }) epltable0: ElementRef;

	@ViewChild('epltable1', { static: false }) epltable1: ElementRef;

	// table display columns
	displayedColumns: string[] = [
		'ledgerdate',
		'ledgerrefid',
		'type',
		'creditamt',
		'debitamt',
		'balamt',
	];
	saleInvoiceDisplayedColumns: string[] = [
		'invoicedate',
		'invoiceno',
		'nettotal',
		'paymentstatus',
		'paidamt',
		'balamt',
		'paybtn',
	];

	paymentDisplayedColumns: string[] = [
		'pymtdate',
		'paymentno',
		'invoiceno',
		'invoicedate',
		'pymtmode',
		'bankref',
		'pymtref',
		'invoiceamt',
		'nowpaid',
		'paidamt',
	];

	pymtTxnDisplayedColumns: string[] = [
		'pymtdate',
		'pymtno',
		'paidamt',
		'paymode',
		'payref',
	];

	// data sources
	ledgerdataSource = new MatTableDataSource<any>();
	saleInvoicedataSource = new MatTableDataSource<any>();

	paymentdataSource = new MatTableDataSource<any>();

	pymttransactionsdataSource = new MatTableDataSource<any>();

	tabIndex = 0;

	constructor(
		private _authservice: AuthenticationService,
		private _cdr: ChangeDetectorRef,
		private _dialog: MatDialog,
		private _commonApiService: CommonApiService,
		private _route: ActivatedRoute,
		private _router: Router
	) {
		this.userdata$ = this._authservice.currentUser;

		this.userdata$
			.pipe(filter((data) => data !== null))
			.subscribe((data: any) => {
				this.center_id = data.center_id;
				this.ready = 1;
				// this.reloadCustomerLedger();
				// this.reloadSaleInvoiceByCustomer();
				// this.reloadPaymentsByCustomer();
				this.init();

				this._cdr.markForCheck();
			});

		this._route.data.subscribe((data) => {
			this.customerdata = data['customerdata'][0];
			this.customer_id = this.customerdata.id;
			this.customer_credit_amount = this.customerdata.credit_amt;
		});

		this._route.params.subscribe((params) => {
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
			this.reloadPymtTransactionByCustomer();
			this.updateCustomerCreditBalance();
		}
	}

	reloadCustomerLedger() {
		this._commonApiService
			.getLedgerCustomer(this.center_id, this.customer_id)
			.subscribe((data: any) => {
				this.totalOutstandingBalance = data[0]?.balance_amt | 0;
				// DnD - code to add a "key/Value" in every object of array
				this.ledgerdataSource.data = data.map((el) => {
					var o = Object.assign({}, el);
					o.isExpanded = false;
					return o;
				});

				this.ledgerdataSource.sort = this.sort;
				this.pageLength = data.length;
				this._cdr.markForCheck();
			});
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this.saleInvoicedataSource.paginator = this.invoiceTablePaginator;
		this.paymentdataSource.paginator = this.pymtTablePaginator;
		this.ledgerdataSource.paginator = this.ledgerTablePaginator;

		this.pymttransactionsdataSource.paginator = this.pymttransactionTablePaginator;
	}

	applyFilter3(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.ledgerdataSource.filter = filterValue;

		if (this.ledgerdataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	applyFilter2(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.paymentdataSource.filter = filterValue;

		if (this.paymentdataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	applyFilter1(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.saleInvoicedataSource.filter = filterValue;

		if (this.saleInvoicedataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	applyFilter4(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.pymttransactionsdataSource.filter = filterValue;

		if (this.pymttransactionsdataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	resetTab4() {
		this.searchbartab4.value = '';
	}

	resetTab2() {
		this.searchbartab2.value = '';
	}

	resetTab3() {
		this.searchbartab3.value = '';
	}

	resetTab1() {
		this.searchbartab1.value = '';
	}

	async tabClick($event) {
		// Ledger Tab
		if ($event.index === 0) {
			this.reloadSaleInvoiceByCustomer();
		} else if ($event.index === 1) {
			this.reloadPaymentsByCustomer();
		} else if ($event.index === 2) {
			this.reloadCustomerLedger();
		} else if ($event.index === 3) {
			this.reloadPymtTransactionByCustomer();
		}

		this._cdr.markForCheck();
	}

	reloadSaleInvoiceByCustomer() {
		this._commonApiService
			.getSaleInvoiceByCustomer(this.center_id, this.customer_id)
			.subscribe((data: any) => {
				// DnD - code to add a "key/Value" in every object of array
				this.saleInvoicedataSource.data = data.map((el) => {
					var o = Object.assign({}, el);
					o.isExpanded = false;
					return o;
				});

				this.saleInvoicedataSource.sort = this.sort;
				this.pageLength = data.length;

				this._cdr.markForCheck();
			});
	}

	reloadPaymentsByCustomer() {
		this._commonApiService
			.getPaymentsByCustomer(this.center_id, this.customer_id)
			.subscribe((data: any) => {
				// DnD - code to add a "key/Value" in every object of array
				this.paymentdataSource.data = data.map((el) => {
					var o = Object.assign({}, el);
					o.isExpanded = false;
					return o;
				});

				this.paymentdataSource.sort = this.sort;
				this.pageLength = data.length;

				this._cdr.markForCheck();
			});
	}

	reloadPymtTransactionByCustomer() {
		this._commonApiService
			.getPymtTransactionByCustomer(this.center_id, this.customer_id)
			.subscribe((data: any) => {
				// DnD - code to add a "key/Value" in every object of array
				this.pymttransactionsdataSource.data = data.map((el) => {
					var o = Object.assign({}, el);
					o.isExpanded = false;
					return o;
				});

				this.pymttransactionsdataSource.sort = this.sort;
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
		dialogConfig.width = '80%';
		dialogConfig.height = '80%';
		dialogConfig.data = {
			customerdata: this.customerdata,
			invoicedata: element,
		};

		const dialogRef = this._dialog.open(
			CustomerPaymentDialogComponent,
			dialogConfig
		);

		dialogRef
			.afterClosed()
			.pipe(
				filter((val) => !!val),
				tap(() => {
					this.init();
					this._cdr.markForCheck();
				})
			)
			.subscribe((data: any) => {
				console.log('object dinesh ');
				if (data === 'success') {
					const dialogConfigSuccess = new MatDialogConfig();
					dialogConfigSuccess.disableClose = false;
					dialogConfigSuccess.autoFocus = true;
					dialogConfigSuccess.width = '25%';
					dialogConfigSuccess.height = '25%';
					dialogConfigSuccess.data = 'Add receivables succesful';

					const dialogRef = this._dialog.open(
						SuccessMessageDialogComponent,
						dialogConfigSuccess
					);
				}
			});
	}

	updateCustomerCreditBalance() {
		this._commonApiService
			.getCustomerDetails(this.center_id, this.customer_id)
			.subscribe((data: any) => {
				this.customer_credit_amount = data.credit_amt;
				this._cdr.markForCheck();
			});
	}
}
