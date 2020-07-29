import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { patternValidator } from 'src/app/util/validators/pattern-validator';

import { GSTN_REGEX, PINCODE_REGEX, EMAIL_REGEX } from "../../../util/helper/patterns";
import { country } from "../../../util/helper/patterns";
import { PhoneValidator } from 'src/app/util/validators/phone.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vendor-add-dialog',
  templateUrl: './vendor-add-dialog.component.html',
  styleUrls: ['./vendor-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorAddDialogComponent implements OnInit {


  center_id: any;
  vendor_id: any;
  resultList: any;
  submitForm: any;

  statesdata: any;
  isLinear = true;



  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<VendorAddDialogComponent>,
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
        Validators.required, PhoneValidator.invalidCountryPhone(country)
      ])],
      mobile: ['', Validators.compose([
        Validators.required, PhoneValidator.invalidCountryPhone(country)
      ])],
      mobile2: ['', Validators.compose([
        Validators.required, PhoneValidator.invalidCountryPhone(country)
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


  }


  onSubmit() {

    if (!this.submitForm.valid) {
      return false;
    }

    this._commonApiService.addVendor(this.submitForm.value).subscribe((data: any) => {

      if (data.body.result === 'success') {
        this.dialogRef.close(data);
      }
    });

  }


  addVendor() {
    this._router.navigate([`/home/vendor/add`]);
  }

  reset() {

  }

  close() {
    this.dialogRef.close();
  }

}
