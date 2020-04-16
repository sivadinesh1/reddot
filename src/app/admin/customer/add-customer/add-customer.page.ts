import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { GSTN_REGEX, country, PINCODE_REGEX, EMAIL_REGEX } from 'src/app/util/helper/patterns';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';


@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.page.html',
  styleUrls: ['./add-customer.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCustomerPage implements OnInit {

  center_id: any;
  vendor_id: any;
  resultList: any;
  submitForm: any;

  statesdata: any;
  isLinear = true;


  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;


    this.submitForm = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({

          center_id: [this.center_id],
          name: [null, Validators.required],
          address1: [''],
          address2: [''],
          address3: [''],

          district: [''],
          state_id: ['', Validators.required],
          pin: ['', [patternValidator(PINCODE_REGEX)]],
        }),
        this._formBuilder.group({
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
        }),

        this._formBuilder.group({
          email: ['', [patternValidator(EMAIL_REGEX)]],
        }),

      ])
    });


    this._commonApiService.getStates().subscribe((data: any) => {
      this.statesdata = data;
    });

  }

  ngOnInit() {


  }





  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.submitForm.get('formArray'); }


  submit() {

    this._commonApiService.addCustomer(this.submitForm.value).subscribe((data: any) => {
      console.log('object.. customer updated ..')
    });

  }

  searchCustomers() {

    this._router.navigate([`/home/view-customers`]);
  }

  addCustomer() {
    this._router.navigate([`/home/customer/add`]);
  }

}
