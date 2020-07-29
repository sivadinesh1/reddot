import { User } from "../../../models/User";
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { throwError, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonApiService } from 'src/app/services/common-api.service';
import { HSNCODE_REGEX, DISC_REGEX } from 'src/app/util/helper/patterns';
import { patternValidator } from 'src/app/util/validators/pattern-validator';

import { MessagesService } from '../../../components/messages/messages.service';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductPage implements OnInit {

  isLinear = true;
  center_id: any;
  brands: any;

  submitForm: FormGroup;
  pexists = false;
  prod_code: any;

  temppcode: any;
  userdata$: Observable<User>;
  userdata: any;

  uom = [
    { key: 'Nos', viewValue: 'Nos' },
    { key: 'Kg', viewValue: 'Kg' },
    { key: 'Ltrs', viewValue: 'Ltrs' }
  ];

  constructor(private _formBuilder: FormBuilder, private _commonApiService: CommonApiService,
    private _cdr: ChangeDetectorRef,
    private _router: Router, private _messagesService: MessagesService,
    private _authservice: AuthenticationService) {

    this.submitForm = this._formBuilder.group({

      center_id: [],
      product_code: ['', Validators.required],
      description: ['', Validators.required],
      brand_id: ['', Validators.required],

      unit: ['', Validators.required],
      packetsize: ['', Validators.required],
      hsncode: [''],

      taxrate: ['', Validators.required],
      minqty: ['', Validators.required],

      unit_price: ['', Validators.required],
      mrp: ['', Validators.required],
      purchaseprice: ['', Validators.required],
      maxdiscount: ['', [patternValidator(DISC_REGEX)]],
      salesprice: ['',],

      currentstock: [0],
      rackno: [''],
      location: [''],
      alternatecode: [''],
      reorderqty: [0],
      avgpurprice: [0],
      avgsaleprice: [0],
      itemdiscount: [0],
      margin: [0],


    });

    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.center_id = this.userdata.center_id;
        this.submitForm.patchValue({
          center_id: this.userdata.center_id,
        });

        this._commonApiService.getAllActiveBrands(this.userdata.center_id, 'A').subscribe((data) => {
          this.brands = data;
        });

        this.init();
        this._cdr.markForCheck();
      });




  }




  ngOnInit() {



  }


  init() {



  }



  isProdExists() {

    this._commonApiService.isProdExists(this.submitForm.value.product_code).subscribe((data: any) => {

      if (data.result.length > 0) {
        if (data.result[0].id > 0) {
          this.pexists = true;
          this.temppcode = data.result[0];
        }
      }

      this._cdr.markForCheck();
    });

  }


  submit() {

    if (!this.submitForm.valid) {
      this._cdr.markForCheck();
      return false;
    }

    this._commonApiService.addProduct(this.submitForm.value).subscribe((data: any) => {
      console.log('successfullly inserted product >>>')

      if (data.body.result === 'success') {
        this.searchProducts();
      } else if (data.body.result === 'error') {

        if (data.body.statusCode === '555') {
          this._messagesService.showErrors(data.body.message);
        }
      }

    });

  }

  searchProducts() {
    this._router.navigate([`/home/view-products`]);

  }

  goProdEdit() {

    this._router.navigate([`/home/product/edit/${this.temppcode.center_id}/${this.temppcode.id}`]);
  }

}
