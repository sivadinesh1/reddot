import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { HSNCODE_REGEX, DISC_REGEX } from 'src/app/util/helper/patterns';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditProductPage implements OnInit {
  isLinear = true;
  center_id: any;
  vendors$: Observable<any>;

  submitForm: FormGroup;

  productinfo: any;

  product_id: any;

  loading = false;
  currentStep: any;

  uom = [
    { key: 'Nos', viewValue: 'Nos' },
    { key: 'Kg', viewValue: 'Kg' },
    { key: 'Ltrs', viewValue: 'Ltrs' }
  ];

  constructor(private _formBuilder: FormBuilder, private _router: Router,
    private _route: ActivatedRoute, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService,
    private _authservice: AuthenticationService) {
    this.currentStep = 0;

    this._route.params.subscribe(params => {
      this.center_id = params['centerid'];
      this.product_id = params['productid'];

      this._cdr.markForCheck();
    });


    this.vendors$ = this._commonApiService.getAllActiveVendors(_route.snapshot.params.centerid);

    this._cdr.markForCheck();




    this._commonApiService.viewProductInfo(_route.snapshot.params.centerid, _route.snapshot.params.productid).subscribe((data) => {
      this.productinfo = data[0];


      this.setFormValues();

      this._cdr.markForCheck();
    });

    this.submitForm = this._formBuilder.group({
      formArray: this._formBuilder.array([
        this._formBuilder.group({
          product_id: _route.snapshot.params.productid,
          center_id: _route.snapshot.params.centerid,
          product_code: [null, Validators.required],
          description: [null, Validators.required],
          vendorid: [null, Validators.required],

        }),
        this._formBuilder.group({
          unit: [null, Validators.required],
          packetsize: [null, Validators.required],
          hsncode: ['', [patternValidator(HSNCODE_REGEX)]],
          taxrate: [null, Validators.required],
          minqty: [null, Validators.required],
        }),

        this._formBuilder.group({
          unit_price: [null, Validators.required],
          mrp: [null, Validators.required],
          purchaseprice: [null, Validators.required],
          salesprice: [null, Validators.required],
          maxdiscount: ['', [patternValidator(DISC_REGEX)]],

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

      if (data.body.result === 'success') {
        this.searchProducts();
      }

    });


  }

  addProduct() {
    this._router.navigate([`/home/product/add`]);
  }




  searchProducts() {
    this._router.navigate([`/home/view-products`]);

  }


}
