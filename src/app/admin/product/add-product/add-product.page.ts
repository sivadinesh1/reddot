import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  isLinear = true;
  center_id: any;
  vendors: any;

  submitForm: FormGroup;

  uom = [
    { key: 'Nos', viewValue: 'Nos' },
    { key: 'Kg', viewValue: 'Kg' },
    { key: 'Ltrs', viewValue: 'Ltrs' }
  ];

  constructor(private _formBuilder: FormBuilder, private _commonApiService: CommonApiService,
    private _router: Router,
    private _authservice: AuthenticationService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;


    _commonApiService.getAllActiveVendors(this.center_id).subscribe((data) => {
      this.vendors = data;
    });


  }

  ngOnInit() {

    this.submitForm = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          center_id: [this.center_id],
          product_code: ['', Validators.required],
          description: ['', Validators.required],
          vendorid: ['', Validators.required],

        }),
        this._formBuilder.group({
          unit: ['', Validators.required],
          packetsize: ['', Validators.required],
          hsncode: ['', Validators.required],
          taxrate: ['', Validators.required],
          minqty: ['', Validators.required],
        }),

        this._formBuilder.group({
          unit_price: ['', Validators.required],
          mrp: ['', Validators.required],
          purchaseprice: ['', Validators.required],
          maxdiscount: ['', Validators.required],
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
        }),


      ])
    });
  }

  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.submitForm.get('formArray'); }




  submit() {

    this._commonApiService.addProduct(this.submitForm.value).subscribe((data: any) => {
      console.log('successfullly inserted product >>>')
    });

  }

  searchProducts() {
    this._router.navigate([`/home/view-products`]);

  }

}






  // fetch vendor values from api