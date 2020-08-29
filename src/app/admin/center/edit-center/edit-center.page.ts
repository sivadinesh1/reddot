import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { EMAIL_REGEX, GSTN_REGEX, country, PINCODE_REGEX } from 'src/app/util/helper/patterns';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-edit-center',
  templateUrl: './edit-center.page.html',
  styleUrls: ['./edit-center.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCenterPage implements OnInit {
  durationInSeconds = 2;
  center_id: any;
  customer_id: any;
  resultList: any;
  submitForm: any;

  statesdata: any;
  isLinear = true;

  userdata$: Observable<User>;
  ready = 0;

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, private _snackBar: MatSnackBar,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService) {

    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.center_id = data.center_id;
        this.ready = 1;
        this.reloadCenterDetails();
        this._cdr.markForCheck();
      });


    this.submitForm = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({

          center_id: [''],
          company_id: [''],
          name: ['', Validators.required],
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
            PhoneValidator.invalidCountryPhone(country)
          ])],
          mobile: ['', Validators.compose([
            PhoneValidator.invalidCountryPhone(country)
          ])],
          mobile2: ['', Validators.compose([
            PhoneValidator.invalidCountryPhone(country)
          ])],
          whatsapp: ['', Validators.compose([
            PhoneValidator.invalidCountryPhone(country)
          ])],
        }),

        this._formBuilder.group({
          email: ['', [patternValidator(EMAIL_REGEX)]],
          bankname: [''],
          accountno: [''],
          ifsccode: [''],
          branch: ['']
        }),

      ])
    });


    this._commonApiService.getStates().subscribe((data: any) => {
      this.statesdata = data;
    });

  }

  ngOnInit() {


  }

  reloadCenterDetails() {
    this._commonApiService.getCenterDetails(this.center_id).subscribe((data: any) => {
      this.resultList = data[0];

      this.setFormValues();

      this._cdr.markForCheck();
    });
  }


  setFormValues() {
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'center_id': this.center_id });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'company_id': this.resultList.company_id });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'name': this.resultList.name });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'address1': this.resultList.address1 });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'address2': this.resultList.address2 });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'address3': this.resultList.address3 });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'district': this.resultList.district });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'state_id': this.resultList.state_id });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'pin': this.resultList.pin });

    (this.submitForm.get('formArray')).get([1]).patchValue({ 'gst': this.resultList.gst });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'phone': this.resultList.phone });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'mobile': this.resultList.mobile });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'mobile2': this.resultList.mobile2 });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'whatsapp': this.resultList.whatsapp });

    (this.submitForm.get('formArray')).get([2]).patchValue({ 'email': this.resultList.email });

    (this.submitForm.get('formArray')).get([2]).patchValue({ 'bankname': this.resultList.bankname });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'accountno': this.resultList.accountno });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'ifsccode': this.resultList.ifsccode });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'branch': this.resultList.branch });


  }


  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.submitForm.get('formArray'); }


  submit() {

    this._commonApiService.updateCenter(this.submitForm.value).subscribe((data: any) => {
      this.updateSnackBar();
    });

  }

  searchCustomers() {

    this._router.navigate([`/home/view-centers`]);
  }

  addCenter() {
    this._router.navigate([`/home/center/add`]);
  }

  updateSnackBar() {
    this._snackBar.openFromComponent(UpdateSnackBarComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

}



@Component({
  selector: 'update-snack-bar',
  template: `<span class="snackbar">
  Center details update successful !!!
</span>`,
  styles: [`
    .snackbar {
      color: #ffffff;
    }
  `],
})
export class UpdateSnackBarComponent { }