import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ShowCustomersComponent } from 'src/app/components/show-customers/show-customers.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CurrencyPadComponent } from 'src/app/components/currency-pad/currency-pad.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { filter, startWith, map, distinctUntilChanged } from 'rxjs/operators';
import { Customer } from 'src/app/models/Customer';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-accounts-receivables',
  templateUrl: './accounts-receivables.component.html',
  styleUrls: ['./accounts-receivables.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsReceivablesComponent implements OnInit {
  customerAdded = false;
  submitForm: FormGroup;


  removeRowArr = [];
  showDelIcon = false;

  maxDate = new Date();


  pymtmodes$: Observable<any>;
  userdata: any;

  userdata$: Observable<User>;

  customer: Customer;
  invoice: any;
  summed = 0;

  errmsg: any;
  balancedue: any;

  filteredCustomer: Observable<any[]>;
  customer_lis: Customer[];
  tabIndex = 0;

  iscustomerselected = false;
  invoicesdata: any;

  customerUnpaidInvoices: any;
  origCustomerUnpaidInvoices: any;
  invoiceamount = 0;
  paidamount = 0;
  distributeBalance = 0;

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private currencyPipe: CurrencyPipe,
    private dialogRef: MatDialogRef<AccountsReceivablesComponent>,
    private _authservice: AuthenticationService, @Inject(MAT_DIALOG_DATA) data: any,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService
  ) {
    this.invoicesdata = data.invoicesdata;

    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.init();
        this._cdr.markForCheck();
      });


    this._route.params.subscribe(params => {
      if (this.userdata !== undefined) {
        this.init();
      }
    });



  }

  async init() {

    this._commonApiService.getAllActiveCustomers(this.userdata.center_id).subscribe((data: any) => {
      this.customer_lis = data;

      this.filteredCustomer = this.submitForm.controls['customer'].valueChanges
        .pipe(
          startWith(''),
          map(customer => customer ? this.filtercustomer(customer) : this.customer_lis.slice())
        );

    });


    this.pymtmodes$ = this._commonApiService.getAllActivePymtModes(this.userdata.center_id, "A");
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

  ngOnInit() {
    // init form values
    this.submitForm = this._fb.group({
      customer: ['', Validators.required],
      centerid: [this.userdata.center_id, Validators.required],
      accountarr: this._fb.array([]),


    });

    // adds first record
    // this.addAccount();

    // subscribes to values chages of "accountarr"
    // this.submitForm.get('accountarr').valueChanges.pipe(
    //   distinctUntilChanged(),
    // ).subscribe(values => {
    //   this.checkTotalSum();
    //   this._cdr.detectChanges()
    // });


  }

  blurFn() {
    this.checkTotalSum();
    this._cdr.detectChanges()
  }

  // initialize the values
  initAccount() {
    return this._fb.group({
      checkbox: [false],
      sale_ref_id: ['', [Validators.required]],
      receivedamount: ['', [Validators.required]],
      receiveddate: ['', Validators.required],
      pymtmode: ['', Validators.required],
      bankref: [''],
      pymtref: [''],
    });

  }

  get accountarr(): FormGroup {
    return this.submitForm.get('accountarr') as FormGroup;
  }

  addAccount() {
    const control = <FormArray>this.submitForm.controls['accountarr'];
    control.push(this.initAccount());

    this.getBalanceDue();
    this._cdr.markForCheck();

  }

  ngAfterViewInit() {
    //this.getBalanceDue();
  }

  // logic to delete using check boxs
  // to solve bug, sort & reverse removedRowArr and then delete using index
  onRemoveRows() {
    this.removeRowArr.sort().reverse();

    this.removeRowArr.forEach((idx) => {
      this.onRemoveAccount(idx);
    });

    this.removeRowArr = [];
    this.delIconStatus();
    this.getBalanceDue();

    this.checkTotalSum();

  }

  onRemoveAccount(idx) {
    (<FormArray>this.submitForm.get('accountarr')).removeAt(idx);
  }

  // form an array of check box clicked to delete, even if one checkbox then show delete icon 
  checkedRow(idx: number) {

    const faControl =
      (<FormArray>this.submitForm.controls['accountarr']).at(idx);
    faControl['controls'].checkbox;

    if (!faControl.value.checkbox) {
      this.removeRowArr.push(idx);
    } else {
      this.removeRowArr = this.removeRowArr.filter(e => e !== idx);
    }
    this.delIconStatus();
    console.log('Array after Check Box..' + this.removeRowArr);

  }

  // show delete icon only if there are any values in removeRowArr
  delIconStatus() {
    if (this.removeRowArr.length > 0) {
      this.showDelIcon = true;
    } else {
      this.showDelIcon = false;
    }
  }


  // method to calculate total payed now and balance due
  checkTotalSum() {
    this.summed = 0;


    const ctrl = <FormArray>this.submitForm.controls['accountarr'];

    let init = 0;

    // iterate each object in the form array
    ctrl.controls.forEach(x => {

      // get the itemmt value and need to parse the input to number

      let parsed = parseFloat((x.get('receivedamount').value === "" || x.get('receivedamount').value === null) ? 0 : x.get('receivedamount').value);
      // add to total

      this.summed += parsed;
      this.getBalanceDue();

      init++;

    });



    if (init == ctrl.controls.length) {
      this.distributeBalance = this.summed;


      this.customerUnpaidInvoices.map(e => {
        console.log('dinesh ' + JSON.stringify(e));

        if (this.distributeBalance > 0) {
          if (e.bal_amount > 0 && (+(e.bal_amount - this.distributeBalance).toFixed(2)) < 0) {
            //excess distribution
            e.paid_amount = e.bal_amount;
            this.distributeBalance = +(this.distributeBalance - e.bal_amount).toFixed(2);
            e.bal_amount = 0;

          } else if (e.bal_amount > 0 && (+(e.bal_amount - this.distributeBalance).toFixed(2)) > 0) {
            //shortage distribution
            e.paid_amount = this.distributeBalance;
            e.bal_amount = +(e.bal_amount - this.distributeBalance).toFixed(2);
            this.distributeBalance = 0;
          }

        }

        this._cdr.markForCheck();
      });



    }


    return true;

  }

  getBalanceDue() {
    this.balancedue = this.invoiceamount - (this.paidamount + this.customer.credit_amt + this.summed);
  }

  onSubmit() {
    if (this.checkTotalSum()) {
      this._commonApiService.addPymtReceived(this.submitForm.value).subscribe((data: any) => {
        if (data.body === 'success') {
          this.submitForm.reset();
          this.dialogRef.close('close');
        } else {
          // todo nothing as of now
        }
        this._cdr.markForCheck();
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  getPosts(event) {
    this.submitForm.patchValue({
      customerid: event.option.value.id,
      customer: event.option.value.name
    });

    this.customer = event.option.value;

    // get all unpaid invoices for a customer

    this.customerUnpaidInvoices = this.invoicesdata.filter(e => e.customer_id === event.option.value.id)
      .filter(e1 => e1.payment_status != 'PAID');

    //this.origCustomerUnpaidInvoices = JSON.parse(JSON.stringify(this.customerUnpaidInvoices));
    this.origCustomerUnpaidInvoices = new Map(this.customerUnpaidInvoices)





    this.invoiceamount = this.customerUnpaidInvoices.reduce(function (acc, curr) {
      return acc + curr.invoice_amt;
    }, 0);

    this.paidamount = this.customerUnpaidInvoices.reduce(function (acc, curr) {
      return acc + curr.paid_amount;
    }, 0);


    this.iscustomerselected = true;

    this.addAccount();

    this._cdr.markForCheck();


  }

  clearInput() {
    this.submitForm.patchValue({
      customerid: 'all',
      customer: ''
    });
    this._cdr.markForCheck();

  }

}
