import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthenticationService } from '../../../services/authentication.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Router } from '@angular/router';
import { MessagesService } from '../../../components/messages/messages.service';
import { throwError } from 'rxjs';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { HSNCODE_REGEX, DISC_REGEX } from 'src/app/util/helper/patterns';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductPage implements OnInit {

  isLinear = true;
  center_id: any;
  vendors: any;

  submitForm: FormGroup;
  pexists = false;
  prod_code: any;

  temppcode: any;

  uom = [
    { key: 'Nos', viewValue: 'Nos' },
    { key: 'Kg', viewValue: 'Kg' },
    { key: 'Ltrs', viewValue: 'Ltrs' }
  ];

  constructor(private _formBuilder: FormBuilder, private _commonApiService: CommonApiService,
    private _cdr: ChangeDetectorRef,
    private _router: Router, private _messagesService: MessagesService,
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
          hsncode: ['', [patternValidator(HSNCODE_REGEX)]],

          taxrate: ['', Validators.required],
          minqty: ['', Validators.required],
        }),

        this._formBuilder.group({
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
        }),


      ])
    });
  }



  /** Returns a FormArray with the name 'formArray'. */
  get formArray(): AbstractControl | null { return this.submitForm.get('formArray'); }


  isProdExists() {
    this.prod_code = (this.submitForm.get('formArray')).get([0]).value.product_code;

    this._commonApiService.isProdExists(this.prod_code).subscribe((data: any) => {

      if (data.result[0].id > 0) {
        this.pexists = true;
        this.temppcode = data.result[0];
      }

      this._cdr.markForCheck();
    });

  }


  submit() {

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







  // fetch vendor values from api