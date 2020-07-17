import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, NgForm } from '@angular/forms';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalController, AlertController } from '@ionic/angular';
import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';
import { CommonApiService } from '../services/common-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

import { Observable } from 'rxjs';
import { filter, map, startWith, debounceTime, switchMap, tap, finalize } from 'rxjs/operators';

import { User } from "../models/User";
import { Customer } from 'src/app/models/Customer';

import { RequireMatch as RequireMatch } from '../util/directives/requireMatch';
import { Product } from '../models/Product';
import { empty, of } from "rxjs";
import { MatAutocompleteTrigger, } from '@angular/material/autocomplete';



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

  isLoading = false;
  isCLoading = false;
  customername: any;
  address1: any;
  address2: any;
  district: any;
  gst: any;
  phone: any;
  whatsapp: any;

  iscustomerselected = false;

  @ViewChild('myForm', { static: true }) myForm: NgForm;
  filteredCustomers: Observable<any[]>;

  // TAB navigation for product list
  @ViewChild('typehead', { read: MatAutocompleteTrigger }) autoTrigger: MatAutocompleteTrigger;

  @ViewChild('plist', { static: true }) plist: any;

  // TAB navigation for customer list
  @ViewChild('typehead1', { read: MatAutocompleteTrigger }) autoTrigger1: MatAutocompleteTrigger;

  customer_lis: Customer[];
  product_lis: Product[];

  selectedCustomerName: any;

  constructor(private _fb: FormBuilder, public dialog: MatDialog, public alertController: AlertController,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _authservice: AuthenticationService,
  ) {

    this.userdata$ = this._authservice.currentUser;

    this.submitForm = this._fb.group({

      customerctrl: [null, [Validators.required, RequireMatch]],

      productctrl: [null, [Validators.required, RequireMatch]],

      center_id: [null, Validators.required],
      remarks: [''],

      productarr: this._fb.array([]),

      tempdesc: [''],
      tempqty: ['1', [Validators.max(1000), Validators.min(0)]]

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


    // this._commonApiService.getAllActiveCustomers(this.center_id).subscribe((data: any) => {
    //   this.customer_lis = data;

    //   this.filteredCustomers = this.submitForm.controls['customerctrl'].valueChanges
    //     .pipe(
    //       startWith(''),
    //       map(customer => customer ? this.filtercustomer(customer) : this.customer_lis.slice())
    //     );

    // });

    this.searchCustomers();
    this.searchProducts();
    this._cdr.markForCheck();
  }

  searchCustomers() {
    let search = "";
    this.submitForm.controls['customerctrl'].valueChanges.pipe(
      debounceTime(500),
      tap(() => this.isCLoading = true),
      switchMap(id => {
        console.log(id);
        search = id;
        if (id != null && id.length >= 3) {
          return this._commonApiService.getCustomerInfo({ "centerid": this.center_id, "searchstr": id });
        } else {
          return empty();
        }

      })

    )

      .subscribe((data: any) => {

        this.isCLoading = false;
        this.customer_lis = data.body;
        this._cdr.markForCheck();
      });
  }

  getLength() {
    const control = <FormArray>this.submitForm.controls['productarr'];
    return control.length;
  }

  searchProducts() {
    let search = "";
    this.submitForm.controls['productctrl'].valueChanges.pipe(
      debounceTime(500),
      tap(() => this.isLoading = true),
      switchMap(id => {
        console.log(id);
        search = id;
        if (id != null && id.length >= 3) {
          return this._commonApiService.getProductInfo({ "centerid": this.center_id, "searchstring": id });
        } else {
          return empty();
        }

      })

    )

      .subscribe((data: any) => {
        this.isLoading = false;
        this.product_lis = data.body;
        this._cdr.markForCheck();
      });
  }


  initProduct() {
    return this._fb.group({
      checkbox: [false],
      product_code: [''],
      notes: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.max(1000), Validators.min(1), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],

    });
  }

  ngAfterViewInit() {
    this.autoTrigger.panelClosingActions.subscribe(x => {
      if (this.autoTrigger.activeOption) {

        this.submitForm.patchValue({
          productctrl: this.autoTrigger.activeOption.value
        });
        this.setItemDesc(this.autoTrigger.activeOption.value, "tab");

      }
    })

    this.autoTrigger1.panelClosingActions.subscribe(x => {
      if (this.autoTrigger1.activeOption) {

        this.submitForm.patchValue({
          customerctrl: this.autoTrigger1.activeOption.value
        });
        this.setCustomerInfo(this.autoTrigger1.activeOption.value, "tab");
      }
    })



  }

  add() {

    if (this.submitForm.value.tempdesc === '' || this.submitForm.value.tempdesc === null) {
      this.submitForm.controls['tempdesc'].setErrors({ 'required': true });
      this.submitForm.controls['tempdesc'].markAsTouched();

      return false;
    }

    if (this.submitForm.value.tempqty === '' || this.submitForm.value.tempqty === null) {
      this.submitForm.controls['tempqty'].setErrors({ 'required': true });
      this.submitForm.controls['tempqty'].markAsTouched();

      return false;
    }

    if (this.submitForm.value.customerctrl === '' || this.submitForm.value.customerctrl === null) {
      this.submitForm.controls['customerctrl'].setErrors({ 'required': true });
      this.submitForm.controls['customerctrl'].markAsTouched();

      return false;
    }




    const control = <FormArray>this.submitForm.controls['productarr'];

    control.insert(0, this._fb.group({
      checkbox: [false],
      product_code: [this.submitForm.value.productctrl.product_code],
      notes: [this.submitForm.value.tempdesc],
      quantity: [this.submitForm.value.tempqty],

    }));

    this.submitForm.patchValue({
      productctrl: "",
      tempdesc: "",
      tempQty: 1,
    });

    this.submitForm.controls['tempdesc'].setErrors(null);
    this.submitForm.controls['tempqty'].setErrors(null);
    this.submitForm.controls['productctrl'].setErrors(null);
    this.plist.nativeElement.focus();
    this._cdr.markForCheck();

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



  // addProduct() {
  //   const control = <FormArray>this.submitForm.controls['productarr'];
  //   control.push(this.initProduct());
  //   this._cdr.markForCheck();
  // }

  clearInput() {
    this.submitForm.patchValue({
      customer: null,
      customerctrl: null
    });
    this.customer_lis = null;
    this.address1 = null;
    this.address2 = null;
    this.district = null;
    this.gst = null;
    this.phone = null;
    this.whatsapp = null;
    this.iscustomerselected = false;
    this._cdr.markForCheck();

  }

  clearProdInput() {

    this.submitForm.patchValue({
      productctrl: null,

      tempdesc: null,
      tempqty: 1
    });
    this.product_lis = null;
    this._cdr.markForCheck();

  }



  onRemoveRows() {
    this.removeRowArr.sort().reverse();
    this.removeRowArr.forEach((idx) => {
      this.onRemoveProduct(idx);
    });

    this.removeRowArr = [];
    this.delIconStatus();
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

  // openCurrencyPad(idx) {

  //   const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

  //   dialogRef.afterClosed().subscribe(
  //     data => {
  //       if (data != undefined && data.length > 0 && data != 0) {

  //         const faControl =
  //           (<FormArray>this.submitForm.controls['productarr']).at(idx);
  //         faControl['controls'].quantity.setValue(data);

  //       }

  //       this._cdr.markForCheck();
  //     }
  //   );
  // }

  onSubmit() {

    console.log('object...' + this.submitForm.value);
    console.log('object..valid.' + this.submitForm.valid);

    if (!this.submitForm.valid) {
      return false;
    }

    this._commonApiService.saveEnquiry(this.submitForm.value).subscribe((data: any) => {
      console.log('object.SAVE ENQ. ' + JSON.stringify(data));

      if (data.body.result === 'success') {

        this.clearInput();
        this.clearProdInput();

        const control = <FormArray>this.submitForm.controls['productarr'];
        control.clear()

        this.submitForm.reset();
        this.myForm.resetForm();

        this._router.navigate([`/home/enquiry/open-enquiry`]);

      } else {

      }

      this._cdr.markForCheck();
    });

  }

  reset() {
    this.clearInput();
    this.clearProdInput();

    const control = <FormArray>this.submitForm.controls['productarr'];
    control.clear()

    this.submitForm.reset();
    this.myForm.resetForm();
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure to clear Inquiry data? ',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes, Proceed',
          handler: () => {
            console.log('Confirm Okay');
            this.reset();

          }
        }
      ]
    });

    await alert.present();
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


  displayFn(obj: any): string | undefined {
    return obj && obj.name ? obj.name : undefined;
  }

  displayProdFn(obj: any): string | undefined {
    return obj && obj.product_code ? obj.product_code : undefined;

  }

  setCustomerInfo(event, from) {

    if (from === 'tab') {
      this.address1 = event.address1;
      this.address2 = event.address2;
      this.district = event.district;
      this.gst = event.gst;
      this.phone = event.mobile;
      this.whatsapp = event.whatsapp;
      this.iscustomerselected = true;
    } else {
      this.address1 = event.option.value.address1;
      this.address2 = event.option.value.address2;
      this.district = event.option.value.district;
      this.gst = event.option.value.gst;
      this.phone = event.mobile;
      this.whatsapp = event.whatsapp;
      this.iscustomerselected = true;
    }


    this._cdr.markForCheck();

  }

  setItemDesc(event, from) {

    if (from === 'tab') {
      this.submitForm.patchValue({
        tempdesc: event.description,
      });
    } else {
      this.submitForm.patchValue({
        tempdesc: event.option.value.description,
      });
    }


    this._cdr.markForCheck();


  }


}


