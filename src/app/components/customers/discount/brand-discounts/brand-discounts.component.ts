import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, Inject, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/models/User';

import { NullToQuotePipe } from 'src/app/util/pipes/null-quote.pipe';
import { AlertController, IonSearchbar } from '@ionic/angular';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from 'src/app/models/Customer';
import { NavigationService } from 'src/app/services/navigation.service';
import { CommonApiService } from 'src/app/services/common-api.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { Brand } from 'src/app/models/Brand';


@Component({
  selector: 'app-brand-discounts',
  templateUrl: './brand-discounts.component.html',
  styleUrls: ['./brand-discounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandDiscountsComponent implements OnInit {

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

  elements: any;
  responsemsg: any;

  pageLength: any;
  isTableHasData = true;
  brandsList: any;
  selectedRowIndex: any;

  mode = "add";
  brandname = "";

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  displayedColumns: string[] = ['brandname', 'type', 'gstzero', 'gstfive', 'gsttwelve', 'gsteighteen', 'gsttwentyeight', 'actions'];
  dataSource = new MatTableDataSource<Brand>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _fb: FormBuilder, private dialogRef: MatDialogRef<BrandDiscountsComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService, @Inject(MAT_DIALOG_DATA) elements: any,
    public alertController: AlertController, public _navigationService: NavigationService,
    private _commonApiService: CommonApiService) {

    this.elements = elements;

    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;



    this.submitForm = this._fb.group({
      customer_id: [this.elements.id, Validators.required],
      center_id: [this.center_id, Validators.required],
      brand_id: [null, Validators.required],
      disctype: [this.elements.type, Validators.required],
      effDiscStDate: new Date(new NullToQuotePipe().transform(this.elements.startdate).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),
      gstzero: [this.elements.gstzero, Validators.required],
      gstfive: [this.elements.gstfive, Validators.required],
      gsttwelve: [this.elements.gsttwelve, Validators.required],
      gsteighteen: [this.elements.gsteighteen, Validators.required],
      gsttwentyeight: [this.elements.gsttwentyeight, Validators.required],
    });




  }


  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.init();
  }

  init() {

    this._commonApiService.getDiscountsByCustomerByBrand(this.center_id, this.elements.id).subscribe((data: any) => {

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

    this._commonApiService.getBrandsMissingDiscounts(this.center_id, "A", this.elements.id)
      .subscribe((data: any) => {
        this.brandsList = data;
        this._cdr.markForCheck();
      })


  }

  highlight(row) {

    this.selectedRowIndex = row.brand_id;
  }

  internalEdit(elements) {
    this.mode = "update";
    this.brandname = elements.brand_name;


    this.submitForm.patchValue({
      brand_id: elements.brand_id,
      effDiscStDate: new Date(new NullToQuotePipe().transform(elements.startdate).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),
      gstzero: elements.gstzero,
      gstfive: elements.gstfive,
      gsttwelve: elements.gsttwelve,
      gsteighteen: elements.gsteighteen,
      gsttwentyeight: elements.gsttwentyeight
    }

    )
    this._cdr.markForCheck();


  }


  // discount date selection
  handleDicountDateChange(event) {
    this.submitForm.patchValue({
      effDiscStDate: event.target.value,

    })
    this._cdr.markForCheck();
  }





  submit(action) {


    if (!this.submitForm.valid) {
      this.responsemsg = 'Mandatory feilds missing!'
      return false;
    } else {

      this.responsemsg = '';
    }



    if (action === 'add') {
      // update discount table, currently only one set of values. 
      // FTRIMPL - date based discounts
      this._commonApiService.addDiscountsByBrand(this.submitForm.value).subscribe((data: any) => {

        // if successfully update
        if (data.body.result === "success") {
          this._commonApiService.getBrandsMissingDiscounts(this.center_id, "A", this.elements.id)
            .subscribe((data: any) => {
              this.brandsList = data;
              this._cdr.markForCheck();
            })
          this.dialogRef.close(data);
        }

      });
    } else if (action === 'update') {
      // update discount table, currently only one set of values. 
      // FTRIMPL - date based discounts

      this._commonApiService.updateDefaultCustomerDiscount(this.submitForm.value).subscribe((data: any) => {

        // if successfully update
        if (data.body === 1) {
          this.dialogRef.close(data);
        }

      });

    }




  }

  reset() {
    this.submitForm.reset(this.initialValues);
  }



  close() {
    this.dialogRef.close();
  }

}


