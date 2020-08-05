import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { GSTN_REGEX, country, PINCODE_REGEX, EMAIL_REGEX } from 'src/app/util/helper/patterns';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/models/Customer';
import { LoadingService } from '../../loading/loading.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-customer-edit-shipping-address',
  templateUrl: './customer-edit-shipping-address.component.html',
  styleUrls: ['./customer-edit-shipping-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    LoadingService
  ],
})
export class CustomerEditShippingAddressComponent implements OnInit {

  center_id: any;
  customer_id: any;
  resultList: any;
  submitForm: any;

  isLinear = true;
  customer: Customer;
  statesdata: any;
  pageLength: any;
  isTableHasData = true;

  isloading = false;
  mode = "add";

  responsemsg: any;
  selectedRowIndex: any;

  displayedColumns: string[] = ['stat', 'address1', 'address2', 'district', 'state', 'pin', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<CustomerEditShippingAddressComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,
    private _loadingService: LoadingService, @Inject(MAT_DIALOG_DATA) customer: Customer,
    private _commonApiService: CommonApiService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

    this.customer = customer;

    this.submitForm = this._formBuilder.group({
      id: [],
      customer_id: [this.customer.id],
      center_id: [this.center_id],

      address1: [],
      address2: [],


      district: [],
      state_id: [Validators.required],
      pin: [null, [patternValidator(PINCODE_REGEX)]],
      def_address: [false]



    });

    this._commonApiService.getStates().subscribe((data: any) => {
      this.statesdata = data;
    });

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.init();

  }

  highlight(row) {

    this.selectedRowIndex = row.id;
  }

  init() {

    this._commonApiService.getShippingAddressByCustomer(this.customer.id).subscribe((data: any) => {


      // this.resultList = data;
      // DnD - code to add a "key/Value" in every object of array
      this.dataSource.data = data.map(el => {
        var o = Object.assign({}, el);
        o.isExpanded = false;
        return o;
      })

      this.dataSource.sort = this.sort;
      this.pageLength = data.length;

      if (data.length === 0) {
        this.isTableHasData = false;
      } else {
        this.isTableHasData = true;
      }

      this._cdr.markForCheck();
    });
  }


  onSubmit(action) {

    const changes = this.submitForm.value;


    if (!this.submitForm.valid) {
      this.responsemsg = 'Mandatory feilds missing!'
      return false;
    } else {

      this.responsemsg = '';
    }

    if (action === 'add') {
      const insertVendor$ = this._commonApiService.insertCustomerShippingAddress(this.submitForm.value);

      this._loadingService.showLoaderUntilCompleted(insertVendor$)
        .subscribe((data: any) => {
          console.log('object.. vendor updated ..')
          this.dialogRef.close(data);
        });

    } else if (action === 'update') {
      const updateVendor$ = this._commonApiService.updateCustomerShippingAddress(this.submitForm.value.id, changes);

      this._loadingService.showLoaderUntilCompleted(updateVendor$)
        .subscribe((data: any) => {
          console.log('object.. vendor updated ..')
          this.dialogRef.close(data);
        });
    }



  }

  internalEdit(elements) {
    this.mode = "update";
    this.isloading = true;



    this.submitForm.patchValue({
      id: elements.id,
      address1: elements.address1,
      address2: elements.address2,
      district: elements.district,
      state_id: elements.state_id,
      pin: elements.pin,
      def_address: elements.def_address === 'N' ? false : true
    }

    )
    this._cdr.markForCheck();


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
