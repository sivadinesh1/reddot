import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { GSTN_REGEX, country, PINCODE_REGEX, EMAIL_REGEX } from 'src/app/util/helper/patterns';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';
import { AlertController } from '@ionic/angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-add-dialog',
  templateUrl: './customer-add-dialog.component.html',
  styleUrls: ['./customer-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerAddDialogComponent implements OnInit {

  center_id: any;
  vendor_id: any;
  resultList: any;
  submitForm: any;

  statesdata: any;
  isLinear = true;

  discountType = ["NET", "GROSS"];

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, public alertController: AlertController,
    private dialogRef: MatDialogRef<CustomerAddDialogComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,

    private _commonApiService: CommonApiService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;


    this.submitForm = this._formBuilder.group({
      center_id: [this.center_id],
      name: [null, Validators.required],

      address1: [''],
      address2: [''],
      address3: [''],

      district: [''],
      state_id: ['', Validators.required],
      pin: ['', [patternValidator(PINCODE_REGEX)]],
      gst: ['', [patternValidator(GSTN_REGEX)]],
      phone: ['', Validators.compose([
        PhoneValidator.invalidCountryPhone(country)
      ])],
      mobile: ['', Validators.compose([
        Validators.required, PhoneValidator.invalidCountryPhone(country)
      ])],
      mobile2: ['', Validators.compose([
        PhoneValidator.invalidCountryPhone(country)
      ])],
      whatsapp: ['', Validators.compose([
        Validators.required, PhoneValidator.invalidCountryPhone(country)
      ])],
      email: ['', [patternValidator(EMAIL_REGEX)]],

      disctype: ['', Validators.required],
      gstzero: [0],
      gstfive: [0],
      gsttwelve: [0],
      gsteighteen: [0],
      gsttwentyeight: [0],

    });


    this._commonApiService.getStates().subscribe((data: any) => {
      this.statesdata = data;
    });

  }

  ngOnInit() {


  }


  onSubmit() {

    if (!this.submitForm.valid) {
      return false;
    }

    this._commonApiService.addCustomer(this.submitForm.value).subscribe((data: any) => {
      console.log('object.. customer updated ..');
      debugger;
      if (data.body.result === 'success') {
        this.dialogRef.close(data);
      }

    });

  }

  close() {
    this.dialogRef.close();
  }

  searchCustomers() {

    this._router.navigate([`/home/view-customers`]);
  }

  addCustomer() {
    this._router.navigate([`/home/customer/add`]);
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Message',

      message: msg,
      buttons: ['OK']
    });

    await alert.present();
    setTimeout(() => {
      this.searchCustomers();
    }, 1000);

  }

  reset() {

  }

}
