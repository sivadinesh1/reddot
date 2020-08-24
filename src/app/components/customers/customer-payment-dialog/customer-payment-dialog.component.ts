import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ShowCustomersComponent } from 'src/app/components/show-customers/show-customers.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { filter } from 'rxjs/operators';

import { Customer } from 'src/app/models/Customer';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-customer-payment-dialog',
  templateUrl: './customer-payment-dialog.component.html',
  styleUrls: ['./customer-payment-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerPaymentDialogComponent implements OnInit {
  customerAdded = false;
  submitForm: FormGroup;
  customerData: any;


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

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private currencyPipe: CurrencyPipe,
    private dialogRef: MatDialogRef<CustomerPaymentDialogComponent>,
    private _authservice: AuthenticationService, @Inject(MAT_DIALOG_DATA) data: any,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService
  ) {

    this.customer = data.customerdata;
    this.invoice = data.invoicedata;

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
    this.pymtmodes$ = this._commonApiService.getAllActivePymtModes(this.userdata.center_id, "A");
  }

  ngOnInit() {
    // init form values
    this.submitForm = this._fb.group({
      customer: [this.customer, Validators.required],
      centerid: [this.userdata.center_id, Validators.required],
      accountarr: this._fb.array([])

    });

    // adds first record
    this.addAccount();

    // subscribes to values chages of "accountarr"
    this.submitForm.get('accountarr').valueChanges.subscribe(values => {
      this.checkTotalSum();
      this._cdr.detectChanges()
    });


  }

  // initialize the values
  initAccount() {
    return this._fb.group({
      checkbox: [false],
      sale_ref_id: [this.invoice.sale_id, [Validators.required]],
      receivedamount: ['', [Validators.required, Validators.max(this.invoice.invoice_amt), Validators.min(0)]],
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

    this._cdr.markForCheck();

  }

  ngAfterViewInit() {
    this.getBalanceDue();
  }



  // method to calculate total payed now and balance due
  checkTotalSum() {
    this.summed = 0;
    const ctrl = <FormArray>this.submitForm.controls['accountarr'];
    // iterate each object in the form array
    ctrl.controls.forEach(x => {
      // get the itemmt value and need to parse the input to number

      let parsed = parseFloat((x.get('receivedamount').value === "" || x.get('receivedamount').value === null) ? 0 : x.get('receivedamount').value);
      // add to total

      this.summed += parsed;
      this.getBalanceDue();

      // current set of paymnets + already paid amount > actual invocie amount then error
      if ((this.summed + this.invoice.paid_amount) > this.invoice.invoice_amt) {
        let val = this.currencyPipe.transform(((this.summed + this.invoice.paid_amount) - this.invoice.invoice_amt), "INR");
        this.errmsg = `Total payment exceeds invoice amount ` + val;
        this._cdr.detectChanges();
        return false;
      } else {
        this.errmsg = ``;
        this._cdr.detectChanges();
      }

    });
    return true;

  }

  getBalanceDue() {
    this.balancedue = this.invoice.invoice_amt - (this.invoice.paid_amount + this.summed)
  }

  onSubmit() {
    if (this.checkTotalSum()) {
      this._commonApiService.addPymtReceived(this.submitForm.value).subscribe((data: any) => {

        if (data.body === 'success') {
          this.submitForm.reset();
          this.dialogRef.close('success');
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

}
