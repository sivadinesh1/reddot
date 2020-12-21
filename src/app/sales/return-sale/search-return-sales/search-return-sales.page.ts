import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from '../../../services/common-api.service';
import { AuthenticationService } from '../../../services/authentication.service';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Sales } from '../../../models/Sales';
import { Customer } from 'src/app/models/Customer';
import { AlertController } from '@ionic/angular';
import { filter, map, startWith } from 'rxjs/operators';
import { User } from 'src/app/models/User';
import { MatDialog, MatDialogConfig, DialogPosition } from '@angular/material/dialog';
import { InvoiceSuccessComponent } from 'src/app/components/invoice-success/invoice-success.component';
import { SalesInvoiceDialogComponent } from 'src/app/components/sales/sales-invoice-dialog/sales-invoice-dialog.component';
import { SaleReturnViewComponent } from 'src/app/components/returns/sale-return-view/sale-return-view.component';



@Component({
  selector: 'app-search-return-sales',
  templateUrl: './search-return-sales.page.html',
  styleUrls: ['./search-return-sales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchReturnSalesPage implements OnInit {

  sales$: Observable<Sales[]>;


  draftSales$: Observable<Sales[]>;
  fullfilledSales$: Observable<Sales[]>;

  filteredSales$: Observable<Sales[]>;

  filteredValues: any;
  tabIndex = 0;

  resultList: any;

  statusFlag = 'D';
  selectedCust = 'all';

  saletypeFlag = 'all';

  today = new Date();
  submitForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  dobMaxDate = new Date();

  fromdate = new Date();
  todate = new Date();

  filteredCustomer: Observable<any[]>;
  customer_lis: Customer[];

  userdata: any;

  userdata$: Observable<User>;

  statusList = [{ "id": "all", "value": "All" }, { "id": "D", "value": "Draft" },
  { "id": "C", "value": "Fullfilled" }
  ]

  saletypeList = [{ "id": "all", "value": "All" }, { "id": "GI", "value": "Invoice" },
  { "id": "SI", "value": "Stock Issue" }]

  searchType =
    [
      { "name": "All", "id": "all", "checked": true },
      { "name": "By Invoice", "id": "byinvoice", "checked": false },
      { "name": "By CreditNote", "id": "bycreditnote", "checked": false }
    ]


  sumTotalValue = 0.00;
  sumNumItems = 0;

  selectedSearchType = "all";

  // new FormControl({value: '', disabled: true});
  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,
    public alertController: AlertController, public _dialog: MatDialog,
    private _authservice: AuthenticationService) {

    this.submitForm = this._fb.group({
      customerid: ['all'],
      customerctrl: new FormControl({ value: 'All Customers', disabled: false }),
      //customerctrl: [{ value: 'All Customers', disabled: false }],
      todate: [this.todate, Validators.required],
      fromdate: [this.fromdate, Validators.required],
      status: new FormControl('all'),
      saletype: new FormControl('all'),
      searchby: [''],
      searchtype: ['all']
    })

    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.init();
        this._cdr.markForCheck();
      });

    const dateOffset = (24 * 60 * 60 * 1000) * 7;
    this.fromdate.setTime(this.minDate.getTime() - dateOffset);


    this._route.params.subscribe(params => {
      if (this.userdata !== undefined) {
        this.init();
      }
    });





  }



  filtercustomer(value: any) {

    if (typeof (value) == "object") {
      return this.customer_lis.filter(customer =>
        customer.name.toLowerCase().indexOf(value.name.toLowerCase()) === 0);
    } else if (typeof (value) == "string") {
      return this.customer_lis.filter(customer =>
        customer.name.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

  }



  async init() {



    this._commonApiService.getAllActiveCustomers(this.userdata.center_id).subscribe((data: any) => {
      this.customer_lis = data;

      this.filteredCustomer = this.submitForm.controls['customerctrl'].valueChanges
        .pipe(
          startWith(''),
          map(customer => customer ? this.filtercustomer(customer) : this.customer_lis.slice())
        );

    });



    this.search();
    this._cdr.markForCheck();

  }

  ngOnInit() {

  }
  // this.form.get('controlname').disable();
  // this.variable.disable()
  searchTypeHandle() {

    if (this.submitForm.value.searchtype !== 'all') {
      this.submitForm.get('customerctrl').disable();
    } else {
      this.submitForm.value.searchby = "";
      this.submitForm.get('customerctrl').enable();
      this.submitForm.controls['searchby'].setErrors(null);
      this.submitForm.controls['searchby'].markAsTouched();
    }
    this.selectedSearchType = this.submitForm.value.searchtype;
  }
  // this.yourFormName.controls.formFieldName.enable();

  clearInput() {
    this.submitForm.patchValue({
      customerid: 'all',
      customerctrl: 'All Customers'
    });
    this._cdr.markForCheck();
    this.search();
  }

  getPosts(event) {
    this.submitForm.patchValue({
      customerid: event.option.value.id,
      customerctrl: event.option.value.name
    });

    this.tabIndex = 0;
    this._cdr.markForCheck();

    this.search();
  }

  async search() {


    if (this.submitForm.value.searchtype !== 'all' && this.submitForm.value.searchby.trim().length === 0) {
      console.log('invoice number is mandatory');
      this.submitForm.controls['searchby'].setErrors({ 'required': true });
      this.submitForm.controls['searchby'].markAsTouched();
      return false;

    }

    this.sales$ = this._commonApiService
      .searchSaleReturn({
        "centerid": this.userdata.center_id, "customerid": this.submitForm.value.customerid,

        "fromdate": this.submitForm.value.fromdate,
        "todate": this.submitForm.value.todate,

        "searchtype": this.submitForm.value.searchtype,
        "searchby": this.submitForm.value.searchby
      }
      );

    this.filteredSales$ = this.sales$;

    // for initial load of first tab (ALL)
    // this.filteredValues = await this.filteredSales$.toPromise();

    let value = await this.filteredSales$.toPromise();
    this.filteredValues = value.filter((data: any) => data.return_status === 'A');


    // to calculate the count on each status    
    this.draftSales$ = this.sales$.pipe(map((arr: any) => arr.filter(f => f.return_status === 'A')));
    this.fullfilledSales$ = this.sales$.pipe(map((arr: any) => arr.filter(f => f.return_status === 'C')));
    this.calculateSumTotals();
    this.tabIndex = 0;
    this._cdr.markForCheck();

  }

  goSalesEditScreen(item) {
    if (item.status === 'C') {
      this.editCompletedSalesConfirm(item);
    } else {
      this._router.navigateByUrl(`/home/sales/edit/${item.id}`);
    }


  }


  goPrintInvoice(row) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = row.id;

    const dialogRef = this._dialog.open(InvoiceSuccessComponent, dialogConfig);

    dialogRef.afterClosed();
  }


  goSalesAddScreen() {
    this._router.navigateByUrl(`/home/sales/edit/0`);
  }

  toDateSelected($event) {
    this.todate = $event.target.value;
    this.tabIndex = 0;
    this.search();
    this._cdr.markForCheck();
  }

  fromDateSelected($event) {
    this.fromdate = $event.target.value;
    this.tabIndex = 0;
    this.search();
    this._cdr.markForCheck();
  }

  delete(item) {
    this._commonApiService.deleteSaleData(item.id).subscribe((data: any) => {

      if (data.result === 'success') {
        this._commonApiService.deleteSaleMaster(item.id).subscribe((data1: any) => {
          this.init();
        });
      }


    })
  }


  async presentAlertConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.delete(item);
          }
        }
      ]
    });

    await alert.present();
  }

  async tabClick($event) {
    let value = await this.filteredSales$.toPromise();

    if ($event.index === 0) {
      this.filteredValues = value.filter((data: any) => data.return_status === 'A');
    } else if ($event.index === 1) {
      this.filteredValues = value.filter((data: any) => data.return_status === 'C');
    }

    this.calculateSumTotals();
    this._cdr.detectChanges();

  }

  calculateSumTotals() {
    this.sumTotalValue = 0.00;
    this.sumNumItems = 0;

    this.sumTotalValue = this.filteredValues.map(item => {
      return item.to_return_amount;
    })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);


    this.sumNumItems = this.filteredValues.map(item => {
      return item.to_receive_items;
    })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }



  async editCompletedSalesConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Editing completed sales, Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Go to sales screen',
          handler: () => {
            console.log('Confirm Okay');
            this._router.navigateByUrl(`/home/sales/edit/${item.id}`);

          }
        }
      ]
    });

    await alert.present();
  }



  salesReturn(row): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.height = "100%";
    dialogConfig.data = row;
    dialogConfig.position = { top: '0', right: '0' };

    const dialogRef = this._dialog.open(SaleReturnViewComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'success') {
        this.presentAlert('Received Items succcessfully!');
      }

    });
  }


  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Message',

      message: msg,
      buttons: ['OK']
    });

    await alert.present();
    setTimeout(() => {
      this.init();
    }, 1000);

  }

}