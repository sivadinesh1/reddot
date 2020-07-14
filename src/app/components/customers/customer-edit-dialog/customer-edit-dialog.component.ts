import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { GSTN_REGEX, country, PINCODE_REGEX, EMAIL_REGEX } from 'src/app/util/helper/patterns';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-customer-edit-dialog',
  templateUrl: './customer-edit-dialog.component.html',
  styleUrls: ['./customer-edit-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerEditDialogComponent implements OnInit {

  center_id: any;
  customer_id: any;
  resultList: any;
  submitForm: any;

  statesdata: any;
  isLinear = true;



  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<CustomerEditDialogComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

    this.customer_id = this._route.snapshot.params['customer_id'];



    this.submitForm = this._formBuilder.group({

      customer_id: [this.customer_id],
      center_id: [this.center_id],
      name: [null, Validators.required],
      address1: [null],
      address2: [null],
      address3: [null],

      district: [null],
      state_id: [null, Validators.required],
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

    });


    this._commonApiService.getStates().subscribe((data: any) => {
      this.statesdata = data;
    });

  }

  ngOnInit() {
    this._commonApiService.getCustomerDetails(this.center_id, this.customer_id).subscribe((data: any) => {
      this.resultList = data[0];
      debugger;
      this.setFormValues();

      this._cdr.markForCheck();
    });

  }



  setFormValues() {
    this.submitForm.patchValue({ name: this.resultList.name });
    this.submitForm.patchValue({ address1: this.resultList.address1 });
    this.submitForm.patchValue({ address2: this.resultList.address2 });
    this.submitForm.patchValue({ address3: this.resultList.address3 });
    this.submitForm.patchValue({ district: this.resultList.district });
    this.submitForm.patchValue({ state_id: this.resultList.state_id });
    this.submitForm.patchValue({ pin: this.resultList.pin });

    this.submitForm.patchValue({ gst: this.resultList.gst });
    this.submitForm.patchValue({ phone: this.resultList.phone });
    this.submitForm.patchValue({ mobile: this.resultList.mobile });
    this.submitForm.patchValue({ mobile2: this.resultList.mobile2 });
    this.submitForm.patchValue({ whatsapp: this.resultList.whatsapp });

    this.submitForm.patchValue({ email: this.resultList.email });


  }



  submit() {

    this._commonApiService.updateCustomer(this.submitForm.value).subscribe((data: any) => {
      console.log('object.. customer updated ..')
    });

  }

  searchCustomers() {

    this._router.navigate([`/home/view-customers`]);
  }

  addCustomer() {
    this._router.navigate([`/home/customer/add`]);
  }

  close() {
    this.dialogRef.close();
  }

  reset() {

  }

}
