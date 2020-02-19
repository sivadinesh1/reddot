import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AdminMenuComponent } from 'src/app/components/admin-menu/admin-menu.component';

@Component({
  selector: 'app-edit-center',
  templateUrl: './edit-center.page.html',
  styleUrls: ['./edit-center.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditCenterPage implements OnInit {

  center_id: any;
  customer_id: any;
  resultList: any;
  submitForm: any;

  statesdata: any;
  isLinear = true;

  @ViewChild(AdminMenuComponent, { static: true }) childComponentMenu: AdminMenuComponent;

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
          company_id: [''],
          name: ['', Validators.required],
          address1: [''],
          address2: [''],
          address3: [''],

          district: [''],
          state_id: ['', Validators.required],
          pin: [],
        }),
        this._formBuilder.group({
          gst: [''],
          phone: [''],
          mobile: [''],
          mobile2: [''],
          whatsapp: [''],
        }),

        this._formBuilder.group({
          email: [''],
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
    this._commonApiService.getCenterDetails(this.center_id).subscribe((data: any) => {
      this.resultList = data[0];

      this.setFormValues();

      this._cdr.markForCheck();
    });

  }



  setFormValues() {
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
      console.log('object.. customer updated ..')
    });

  }

  searchCustomers() {

    this._router.navigate([`/home/view-centers`]);
  }

  addCenter() {
    this._router.navigate([`/home/center/add`]);
  }

}
