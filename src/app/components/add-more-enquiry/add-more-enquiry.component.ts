import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CurrencyPadComponent } from '../currency-pad/currency-pad.component';
import { Product } from 'src/app/models/Product';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-more-enquiry',
  templateUrl: './add-more-enquiry.component.html',
  styleUrls: ['./add-more-enquiry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMoreEnquiryComponent implements OnInit {

  submitForm: FormGroup;

  customerAdded = false;
  customerData: any;

  removeRowArr = [];
  showDelIcon = false;
  centerid: any;
  userid: any;

  data: any;
  isLoading = false;
  product_lis: Product[];

  @ViewChild('myForm', { static: true }) myForm: NgForm;

  // TAB navigation for product list
  @ViewChild('typehead', { read: MatAutocompleteTrigger }) autoTrigger: MatAutocompleteTrigger;

  @ViewChild('plist', { static: true }) plist: any;

  constructor(private _fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<AddMoreEnquiryComponent>,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _authservice: AuthenticationService,
  ) {

    this.submitForm = this._fb.group({
      enquiry_id: [data.enquiry_id, Validators.required],
      customer: [data.customer_id, Validators.required],
      centerid: [data.center_id, Validators.required],
      remarks: [''],

      productarr: this._fb.array([])

    });
    //console.log('object' + data);

  }

  ngOnInit() {
    this.init();
  }


  init() {



    this.customerData = "";
    this.customerAdded = false;


    this.addProduct();
    // this.addProduct();
    // this.addProduct();
    // this.addProduct();
    // this.addProduct();



    this._cdr.markForCheck();
  }

  get productarr(): FormGroup {
    return this.submitForm.get('productarr') as FormGroup;
  }



  addProduct() {
    const control = <FormArray>this.submitForm.controls['productarr'];
    control.push(this.initProduct());
    this._cdr.markForCheck();
  }


  initProduct() {
    return this._fb.group({
      checkbox: [false],
      product_code: [''],
      notes: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.max(1000), Validators.min(1), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],

    });
  }


  clearProdInput() {

    this.submitForm.patchValue({
      product_code: null,

      tempdesc: null,
      tempqty: 1
    });
    this.product_lis = null;
    this._cdr.markForCheck();

  }



  setItemDesc(event, from) {

    if (from === 'tab') {
      this.submitForm.patchValue({
        tempdesc: event.description,
      });
    } else {
      this.submitForm.patchValue({
        tempdesc: event.option.value.description,
      });
    }


    this._cdr.markForCheck();


  }

  onRemoveRows() {
    this.removeRowArr.sort().reverse();
    this.removeRowArr.forEach((idx) => {
      this.onRemoveProduct(idx);
    });

    this.removeRowArr = [];
  }

  onRemoveProduct(idx) {
    console.log('object ' + this.removeRowArr);
    (<FormArray>this.submitForm.get('productarr')).removeAt(idx);
  }


  checkedRow(idx: number) {

    const faControl =
      (<FormArray>this.submitForm.controls['productarr']).at(idx);
    faControl['controls'].checkbox;

    if (!faControl.value.checkbox) {
      this.removeRowArr.push(idx);
    } else {
      this.removeRowArr = this.removeRowArr.filter(e => e !== idx);
    }
    this.delIconStatus();
    console.log('object..' + this.removeRowArr);

  }


  delIconStatus() {
    if (this.removeRowArr.length > 0) {
      this.showDelIcon = true;
    } else {
      this.showDelIcon = false;
    }
  }

  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {

          const faControl =
            (<FormArray>this.submitForm.controls['productarr']).at(idx);
          faControl['controls'].quantity.setValue(data);




        }

        this._cdr.markForCheck();
      }
    );
  }

  displayProdFn(obj: any): string | undefined {
    return obj && obj.product_code ? obj.product_code : undefined;

  }

  onSubmit() {

    if (!this.submitForm.valid) {
      return false;
    }


    this._commonApiService.addMoreEnquiry(this.submitForm.value).subscribe((data: any) => {
      this.submitForm.reset();
      this.myForm.resetForm();
      this.dialogRef.close('success');
      this._cdr.markForCheck();
    });


  }

  close() {
    this.dialogRef.close();
  }

}

