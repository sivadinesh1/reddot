import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { AdminMenuComponent } from 'src/app/components/admin-menu/admin-menu.component';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.page.html',
  styleUrls: ['./add-vendor.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddVendorPage implements OnInit {

  center_id: any;
  vendor_id: any;
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
          name: [null, Validators.required],
          address1: [''],
          address2: [''],
          address3: [''],

          district: [''],
          state_id: ['', Validators.required],
          pin: [''],
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

    this._commonApiService.addVendor(this.submitForm.value).subscribe((data: any) => {
      console.log('object.. vendor updated ..')
    });

  }

  searchVendors() {

    this._router.navigate([`/home/view-vendors`]);
  }

  addVendor() {
    this._router.navigate([`/home/vendor/add`]);
  }

}
