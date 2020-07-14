import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, NgForm } from '@angular/forms';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';
import { CommonApiService } from '../services/common-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { User } from "../models/User";
import { Customer } from 'src/app/models/Customer';

import { RequireMatch as RequireMatch } from '../util/directives/requireMatch';


@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryPage {

  submitForm: FormGroup;

  customerAdded = false;
  customerData: any;

  removeRowArr = [];
  showDelIcon = false;
  center_id: any;
  tabIndex = 0;

  userdata$: Observable<User>;
  userdata: any;

  @ViewChild('myForm', { static: true }) myForm: NgForm;
  filteredCustomer: Observable<any[]>;
  customer_lis: Customer[];

  selectedCustomerName: any;

  constructor(private _fb: FormBuilder, public dialog: MatDialog,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _authservice: AuthenticationService,
  ) {

    this.userdata$ = this._authservice.currentUser;

    this.submitForm = this._fb.group({
      customerid: [],
      customerctrl: [null, [Validators.required, RequireMatch]],

      center_id: [null, Validators.required],
      remarks: [''],

      productarr: this._fb.array([])

    });

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.center_id = this.userdata.center_id;

        this.submitForm.patchValue({
          center_id: this.userdata.center_id,
        });


        this.init();
        this._cdr.markForCheck();
      });


    this._route.params.subscribe(params => {
      this._cdr.markForCheck();
    });

  }

  get productarr(): FormGroup {
    return this.submitForm.get('productarr') as FormGroup;
  }


  async init() {

    this.customerData = "";
    this.customerAdded = false;

    this.addProduct();
    this.addProduct();
    this.addProduct();
    this.addProduct();
    this.addProduct();

    this._commonApiService.getAllActiveCustomers(this.center_id).subscribe((data: any) => {
      this.customer_lis = data;

      this.filteredCustomer = this.submitForm.controls['customerctrl'].valueChanges
        .pipe(
          startWith(''),
          map(customer => customer ? this.filtercustomer(customer) : this.customer_lis.slice())
        );

    });



    this._cdr.markForCheck();
  }

  initProduct() {
    return this._fb.group({
      checkbox: [false],
      product_code: [''],
      notes: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.max(1000), Validators.min(1), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],

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

  addProduct() {
    const control = <FormArray>this.submitForm.controls['productarr'];
    control.push(this.initProduct());
    this._cdr.markForCheck();
  }

  clearInput() {
    this.submitForm.patchValue({
      customer: 'all',
      customerctrl: ''
    });
    this._cdr.markForCheck();

  }

  onRemoveRows() {
    this.removeRowArr.sort().reverse();
    this.removeRowArr.forEach((idx) => {
      this.onRemoveProduct(idx);
    });

    this.removeRowArr = [];
  }

  onRemoveProduct(idx) {
    console.log('object ' + this.removeRowArr);
    (<FormArray>this.submitForm.get('productarr')).removeAt(idx);
  }


  checkedRow(idx: number, $event) {

    const faControl =
      (<FormArray>this.submitForm.controls['productarr']).at(idx);
    faControl['controls'].checkbox;


    if (faControl.value.checkbox) {
      this.removeRowArr.push(idx);
    } else {
      this.removeRowArr = this.removeRowArr.filter(e => e !== idx);
    }
    this.delIconStatus();
    console.log('object..' + this.removeRowArr);

  }


  delIconStatus() {
    if (this.removeRowArr.length > 0) {
      this.showDelIcon = true;
    } else {
      this.showDelIcon = false;
    }
  }

  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {

          const faControl =
            (<FormArray>this.submitForm.controls['productarr']).at(idx);
          faControl['controls'].quantity.setValue(data);

        }

        this._cdr.markForCheck();
      }
    );
  }

  onSubmit() {

    console.log('object...' + this.submitForm.value);

    if (!this.submitForm.valid) {
      return false;
    }

    this._commonApiService.saveEnquiry(this.submitForm.value).subscribe((data: any) => {
      console.log('object.SAVE ENQ. ' + JSON.stringify(data));

      if (data.body.result === 'success') {

        this.submitForm.reset();
        this.myForm.resetForm();

        this._router.navigate([`/home/enquiry/open-enquiry`]);

      } else {

      }

      this._cdr.markForCheck();
    });

  }



  async showAllCustomersComp() {

    const modal = await this._modalcontroller.create({
      component: ShowCustomersComponent,
      componentProps: {},
      cssClass: 'customer-comp-styl'

    });


    modal.onDidDismiss().then((result) => {
      let custData = result.data;

      if (custData !== undefined) {
        this.customerAdded = true;


        this.submitForm.patchValue({
          customer: custData,
        });

        this.customerData = custData;
      }



      this._cdr.markForCheck();

    })

    await modal.present();
  }

  openEnquiry() {
    this._router.navigateByUrl('/home/enquiry/open-enquiry');
  }

  openBackOrder() {
    this._router.navigateByUrl('/home/enquiry/back-order');
  }

  displayWith(obj?: any): string | undefined {
    return obj ? obj.name : undefined;
  }

  // displayFn(user: User): string {
  //   return user && user.name ? user.name : '';
  // }

  displayFn(obj: any): string | undefined {
    return obj && obj.name ? obj.name : undefined;

  }

  // getPosts(event) {

  //   this.submitForm.patchValue({
  //     customerid: event.option.value.id,
  //     customerctrl: event.option.value.name
  //   });
  //   this.customerData = event.option.value;
  //   this.selectedCustomerName = event.option.value.name;

  //   this.tabIndex = 0;
  //   this._cdr.markForCheck();


  // }

  // checkCustomer() {

  //   if (this.selectedCustomerName !== this.submitForm.controls['customerctrl'].value) {
  //     this.submitForm.controls['customerctrl'].setValue(null);
  //     // this.selectedCountry = '';
  //   }
  // }

}


