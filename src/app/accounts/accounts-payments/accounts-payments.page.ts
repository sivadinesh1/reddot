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
import { AccountsReceivablesComponent } from 'src/app/components/accounts/accounts-receivables/accounts-receivables.component';
import { SuccessMessageDialogComponent } from 'src/app/components/success-message-dialog/success-message-dialog.component';

@Component({
	selector: 'app-accounts-payments',
	templateUrl: './accounts-payments.page.html',
	styleUrls: ['./accounts-payments.page.scss'],
})
export class AccountsPaymentsPage implements OnInit {
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

	customerslist: any;
	customersOriglist: any;

	@ViewChild('searchbartab2', { static: true }) searchbartab2: IonSearchbar;
	@ViewChild('searchbartab1', { static: true }) searchbartab1: IonSearchbar;
	@ViewChild('searchbartab3', { static: true }) searchbartab3: IonSearchbar;

	@ViewChild('InvoiceTablePaginator') invoiceTablePaginator: MatPaginator;
	@ViewChild('PaymentTablePaginator') pymtTablePaginator: MatPaginator;
	@ViewChild('PymtTransactionTablePaginator')
	pymttransactionTablePaginator: MatPaginator;

	@ViewChild(MatSort, { static: true }) sort: MatSort;

	@ViewChild('epltable1', { static: false }) epltable1: ElementRef;

	// table display columns
	saleInvoiceDisplayedColumns: string[] = [
		'invoicedate',
		'invoiceno',
		'customername',
		'nettotal',
		'paymentstatus',
		'paidamt',
		'balamt',
		'paybtn',
	];
	paymentDisplayedColumns: string[] = [
		'customername',
		'pymtdate',
		'paymentno',
		'invoiceno',
		'invoicedate',
		'pymtmodename',
		'bankref',
		'pymtref',
		'paidamt',
	];
	pymtTxnDisplayedColumns: string[] = [
		'custname',
		'pymtno',
		'pymtdate',
		'paidamt',
		'paymode',
		'bankref',
		'payref',
	];

	// data sources
	paymentdataSource = new MatTableDataSource<any>();
	pymttransactionsdataSource = new MatTableDataSource<any>();
	saleInvoicedataSource = new MatTableDataSource<any>();

	tabIndex = 0;
	invoicesdata: any;

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
				this._authservice.setCurrentMenu('PAYMENTS');
				this.userdata = data;
				this.ready = 1;
				this.init();

				this._cdr.markForCheck();
			});

		this._route.params.subscribe((params) => {
			if (this.userdata !== undefined) {
				this.init();
			}
		});
	}

	init() {
		if (this.ready === 1) {
			this.reloadSaleInvoiceByCenter(this.userdata.center_id);
			this.reloadPaymentsByCenter(this.userdata.center_id);
			this.reloadTransactionsByCenter(this.userdata.center_id);
		}
	}

	ngOnInit() {}

	ngAfterViewInit() {
		this.saleInvoicedataSource.paginator = this.invoiceTablePaginator;
		this.paymentdataSource.paginator = this.pymtTablePaginator;
		this.pymttransactionsdataSource.paginator = this.pymttransactionTablePaginator;
	}

	async tabClick($event) {
		// Ledger Tab
		if ($event.index === 0) {
			this.reloadSaleInvoiceByCenter(this.userdata.center_id);
		} else if ($event.index === 1) {
			this.reloadPaymentsByCenter(this.userdata.center_id);
		} else if ($event.index === 2) {
			this.reloadTransactionsByCenter(this.userdata.center_id);
		}

		this._cdr.markForCheck();
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

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.paymentdataSource.filter = filterValue;

		if (this.paymentdataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	applyFilter3(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.pymttransactionsdataSource.filter = filterValue;

		if (this.pymttransactionsdataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	applyFilterTab1(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
		this.saleInvoicedataSource.filter = filterValue;

		if (this.saleInvoicedataSource.filteredData.length > 0) {
			this.isTableHasData = true;
		} else {
			this.isTableHasData = false;
		}
	}

	reloadPaymentsByCenter(center_id) {
		this._commonApiService
			.getPaymentsByCenter(center_id)
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

	reloadTransactionsByCenter(center_id) {
		this._commonApiService
			.getPymtTransactionsByCenter(center_id)
			.subscribe((data: any) => {
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

	reloadSaleInvoiceByCenter(center_id) {
		this._commonApiService
			.getSaleInvoiceByCenter(center_id)
			.subscribe((data: any) => {
				this.invoicesdata = data;

				this.saleInvoicedataSource.data = this.invoicesdata.filter(
					(data: any) => {
						return data.payment_status !== 'PAID';
					}
				);

				// DnD - code to add a "key/Value" in every object of array
				// this.saleInvoicedataSource.data = data.map(el => {
				//   var o = Object.assign({}, el);
				//   o.isExpanded = false;
				//   return o;
				// })

				this.saleInvoicedataSource.sort = this.sort;
				this.pageLength = data.length;

				this._cdr.markForCheck();
			});
	}

	viewAllCustomers() {
		this._router.navigate([`/home/view-customers`]);
	}

	goCustomerFinancials(customer_id) {
		this._router.navigate([
			`/home/financials-customer/${this.userdata.center_id}/${customer_id}`,
		]);
	}

	// can be deleted not used
	addPayments() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '80%';
		dialogConfig.height = '80%';
		dialogConfig.data = { invoicesdata: this.invoicesdata };

		const dialogRef = this._dialog.open(
			AccountsReceivablesComponent,
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
			.subscribe();
	}

	addPaymentsBillToBill(element) {
		let success = 0;

		this._commonApiService
			.getCustomerDetails(this.userdata.center_id, element.customer_id)
			.subscribe((customerdata) => {
				const dialogConfig = new MatDialogConfig();
				dialogConfig.disableClose = true;
				dialogConfig.autoFocus = true;
				dialogConfig.width = '80%';
				dialogConfig.height = '80%';
				dialogConfig.data = {
					customerdata: customerdata[0],
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
			});
	}
}
