import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/models/User';
import { filter } from 'rxjs/operators';



import { NullToQuotePipe } from 'src/app/util/pipes/null-quote.pipe';
import { AlertController } from '@ionic/angular';
import { NavigationService } from '../../../services/navigation.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/models/Customer';



@Component({
  selector: 'app-customer-discount-dialog',
  templateUrl: './customer-discount-dialog.component.html',
  styleUrls: ['./customer-discount-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDiscountDialogComponent implements OnInit {

  center_id: any;
  vendor_id: any;
  resultList: any;
  submitForm: FormGroup;

  isLinear = true;
  customer_id: any;

  // only 2 type of discount
  discountType = ["NET", "GROSS"];

  userdata$: Observable<User>;
  userdata: any;
  ready = 0; // flag check - centerid (localstorage) & customerid (param)
  selectedDiscType = 'NET'; // default
  selectedEffDiscStDate: any;

  objForm = [];
  @ViewChild('myForm', { static: true }) myForm: NgForm;
  initialValues: any;
  customerName: string;

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _fb: FormBuilder, private dialogRef: MatDialogRef<CustomerDiscountDialogComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService, @Inject(MAT_DIALOG_DATA) customer: Customer,
    public alertController: AlertController, public _navigationService: NavigationService,
    private _commonApiService: CommonApiService) {

    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;
    this.customer_id = customer.id;


    this.submitForm = this._fb.group({
      customer_id: [customer.id],
      center_id: [this.center_id],
      disctype: ['', Validators.required],
      effDiscStDate: ['', Validators.required],
      gstzero: [0, Validators.required],
      gstfive: [0, Validators.required],
      gsttwelve: [0, Validators.required],
      gsteighteen: [0, Validators.required],
      gsttwentyeight: [0, Validators.required],
    });


    // this._route.params.subscribe(params => {

    //   this.customer_id = this._route.snapshot.params['customer_id'];

    //   this.init();

    // });

  }


  ngOnInit() {
    this.init();
  }

  init() {

    //  if (this.ready === 1) {  // ready = 1 only after userdata observable returns 
    this.reloadCustomerDiscounts();
    // }
  }

  // load default values which are set duing customer creation
  reloadCustomerDiscounts() {

    // null check not needed as every customer discount is set during customer creation
    this._commonApiService.getCustomerDiscount(this.center_id, this.customer_id)
      .subscribe((data: any) => {
        let temp = data;

        // return 5 rows for each tax slab. all 5 rows will have common "Type" & "Startdate"
        // populate disctype & effdiscstartdate to display in UI
        this.selectedDiscType = temp[0].type;
        this.selectedEffDiscStDate = temp[0].startdate;
        this.customerName = temp[0].customer_name;

        // loops the array & populate individual tax value to set in form object
        let Tax0 = temp.find((o) => o.gst_slab === 0).value;
        let Tax5 = temp.find((o) => o.gst_slab === 5).value;
        let Tax12 = temp.find((o) => o.gst_slab === 12).value;
        let Tax18 = temp.find((o) => o.gst_slab === 18).value;
        let Tax28 = temp.find((o) => o.gst_slab === 28).value;


        this.objForm = [];
        // for a new array length [5] to send to backend. hardcoded end date for ever
        // FTRIMPL - make end date customizable
        temp.forEach(element => {
          this.objForm.push({
            "id": element.id,
            "center_id": element.center_id, "customer_id": element.customer_id,
            "type": element.type, "value": element.value,
            "gst_slab": element.gst_slab, "startdate": element.startdate, "enddate": "01-04-9999"
          })

        });


        // populate to show in FE
        this.submitForm.patchValue({
          disctype: data[0].type,
          effDiscStDate: new Date(new NullToQuotePipe().transform(data[0].startdate).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),

          gstzero: Tax0,
          gstfive: Tax5,
          gsttwelve: Tax12,
          gsteighteen: Tax18,
          gsttwentyeight: Tax28,
          customer_id: this.customer_id,
          center_id: this.center_id

        });

        this.initialValues = this.submitForm.value;

        this._cdr.markForCheck();

      })

  }

  // discount date selection
  handleDicountDateChange(event) {
    this.submitForm.patchValue({
      effDiscStDate: event.target.value,

    })
    this._cdr.markForCheck();
  }



  submit() {


    if (!this.submitForm.valid) {
      return false;
    }

    //loop thru form obj & set appropriate tax values. Array order is not always same, 
    // so check the tax slab before setting
    this.objForm.forEach((element, idx) => {
      if (element.gst_slab === 0) {
        this.objForm[idx].value = this.submitForm.value.gstzero;
      } else if (element.gst_slab === 5) {
        this.objForm[idx].value = this.submitForm.value.gstfive;
      } else if (element.gst_slab === 12) {
        this.objForm[idx].value = this.submitForm.value.gsttwelve;
      } else if (element.gst_slab === 18) {
        this.objForm[idx].value = this.submitForm.value.gsteighteen;
      } else if (element.gst_slab === 28) {
        this.objForm[idx].value = this.submitForm.value.gsttwentyeight;
      }

    });

    this.objForm[0].type = this.submitForm.value.disctype;
    this.objForm[1].type = this.submitForm.value.disctype;
    this.objForm[2].type = this.submitForm.value.disctype;
    this.objForm[3].type = this.submitForm.value.disctype;
    this.objForm[4].type = this.submitForm.value.disctype;

    this.objForm[0].startdate = this.submitForm.value.effDiscStDate;
    this.objForm[1].startdate = this.submitForm.value.effDiscStDate;
    this.objForm[2].startdate = this.submitForm.value.effDiscStDate;
    this.objForm[3].startdate = this.submitForm.value.effDiscStDate;
    this.objForm[4].startdate = this.submitForm.value.effDiscStDate;

    // update discount table, currently only one set of values. 
    // FTRIMPL - date based discounts
    this._commonApiService.updateCustomerDiscount(this.objForm).subscribe((data: any) => {

      // if successfully update
      if (data.body === 1) {
        this.dialogRef.close(data);
      }

    });

  }

  reset() {
    this.submitForm.reset(this.initialValues);
  }

  // async presentAlert(msg: string) {
  //   const alert = await this.alertController.create({
  //     header: 'Message',

  //     message: msg,
  //     buttons: ['OK']
  //   });

  //   await alert.present();
  //   setTimeout(() => {
  //     this._navigationService.searchCustomers();
  //   }, 1000);

  // }

  close() {
    this.dialogRef.close();
  }

}


