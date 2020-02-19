import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProductPage implements OnInit {
  isLinear = true;
  center_id: any;
  vendors: any;

  submitForm: FormGroup;

  productinfo: any;

  product_id: any;

  loading = false;

  uom = [
    { key: 'Nos', viewValue: 'Nos' },
    { key: 'Kg', viewValue: 'Kg' },
    { key: 'Ltrs', viewValue: 'Ltrs' }
  ];

  constructor(private _formBuilder: FormBuilder, private _router: Router,
    private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService,
    private _authservice: AuthenticationService) {

    this._route.params.subscribe(params => {
      this.product_id = params["product_id"];
    });

    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;


    this._commonApiService.getAllActiveVendors(this.center_id).subscribe((data) => {
      this.vendors = data;
      this._cdr.markForCheck();
    });



    this._commonApiService.viewProductInfo(this.center_id, this.product_id).subscribe((data) => {
      this.productinfo = data[0];


      this.setFormValues();

      this._cdr.markForCheck();
    });


    this.submitForm = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          product_id: [this.product_id],
          center_id: [this.center_id],
          product_code: [null, Validators.required],
          description: [null, Validators.required],
          vendorid: [null, Validators.required],

        }),
        this._formBuilder.group({
          unit: [null, Validators.required],
          packetsize: [null, Validators.required],
          hsncode: [null, Validators.required],
          taxrate: [null, Validators.required],
          minqty: [null, Validators.required],
        }),

        this._formBuilder.group({
          unit_price: [null, Validators.required],
          mrp: [null, Validators.required],
          purchaseprice: [null, Validators.required],
          salesprice: [null, Validators.required],
          maxdiscount: [null, Validators.required],

          currentstock: [null],
          rackno: [null],
          location: [null],
          alternatecode: [null],
          reorderqty: [null],
          avgpurprice: [null],
          avgsaleprice: [null],
          itemdiscount: [null],
          margin: [null],
        }),


      ])
    });

  }

  ngOnInit() {



    // this.submitForm = this._formBuilder.group({
    //   formArray: this._formBuilder.array([
    //     this._formBuilder.group({
    //       center_id: [this.center_id],
    //       product_code: [this.product_code, Validators.required],
    //       description: [this.productinfo.description, Validators.required],
    //       vendorid: [this.productinfo.vendorid, Validators.required],

    //     }),
    //     this._formBuilder.group({
    //       unit: [this.productinfo.unit, Validators.required],
    //       packetsize: [this.productinfo.packetsize, Validators.required],
    //       hsncode: [this.productinfo.hsncode, Validators.required],
    //       taxrate: [this.productinfo.taxrate, Validators.required],
    //       minqty: [this.productinfo.minqty, Validators.required],
    //     }),

    //     this._formBuilder.group({
    //       unit_price: [this.productinfo.unit_price, Validators.required],
    //       mrp: [this.productinfo.mrp, Validators.required],
    //       purchaseprice: [this.productinfo.purchaseprice, Validators.required],
    //       salesprice: [this.productinfo.salesprice, Validators.required],
    //       maxdiscount: [this.productinfo.maxdiscount, Validators.required],

    //       currentstock: [this.productinfo.currentstock],
    //       rackno: [this.productinfo.rackno],
    //       location: [this.productinfo.location],
    //       alternatecode: [this.productinfo.alternatecode],
    //       reorderqty: [this.productinfo.reorderqty],
    //       avgpurprice: [this.productinfo.avgpurprice],
    //       avgsaleprice: [this.productinfo.avgsaleprice],
    //       itemdiscount: [this.productinfo.itemdiscount],
    //       margin: [this.productinfo.margin],
    //     }),


    //   ])
    // });
  }


  setFormValues() {
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'product_code': this.productinfo.product_code });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'description': this.productinfo.description });
    (this.submitForm.get('formArray')).get([0]).patchValue({ 'vendorid': this.productinfo.vendor_id });

    (this.submitForm.get('formArray')).get([1]).patchValue({ 'unit': this.productinfo.unit });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'packetsize': this.productinfo.packetsize });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'hsncode': this.productinfo.hsncode });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'taxrate': this.productinfo.taxrate });
    (this.submitForm.get('formArray')).get([1]).patchValue({ 'minqty': this.productinfo.minqty });

    (this.submitForm.get('formArray')).get([2]).patchValue({ 'unit_price': this.productinfo.unit_price });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'mrp': this.productinfo.mrp });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'purchaseprice': this.productinfo.purchaseprice });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'salesprice': this.productinfo.salesprice });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'maxdiscount': this.productinfo.maxdiscount });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'currentstock': this.productinfo.currentstock });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'rackno': this.productinfo.rackno });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'location': this.productinfo.location });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'alternatecode': this.productinfo.alternatecode });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'reorderqty': this.productinfo.reorderqty });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'avgpurprice': this.productinfo.avgpurprice });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'avgsaleprice': this.productinfo.avgsaleprice });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'itemdiscount': this.productinfo.itemdiscount });
    (this.submitForm.get('formArray')).get([2]).patchValue({ 'margin': this.productinfo.margin });



    this._cdr.markForCheck();
  }


  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.submitForm.get('formArray'); }

  submit() {

    this._commonApiService.updateProduct(this.submitForm.value).subscribe((data: any) => {
      console.log('object... update successful');
      //  this._router.navigate([`/home/view-product`, this.center_id, this.product_code]);
    });


  }

  addProduct() {
    this._router.navigate([`/home/product/add`]);
  }




  searchProducts() {
    this._router.navigate([`/home/view-products`]);

  }


}
