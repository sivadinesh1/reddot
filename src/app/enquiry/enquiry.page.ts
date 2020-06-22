import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray, NgForm } from '@angular/forms';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';
import { CommonApiService } from '../services/common-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryPage implements OnInit {

  submitForm: FormGroup;

  customerAdded = false;
  customerData: any;

  removeRowArr = [];
  showDelIcon = false;
  centerid: any;
  userid: any;


  @ViewChild('myForm', { static: true }) myForm: NgForm;

  constructor(private _fb: FormBuilder, public dialog: MatDialog,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _authservice: AuthenticationService,
  ) {

    const currentUser = this._authservice.currentUserValue;
    this.submitForm = this._fb.group({
      customer: [null, Validators.required],
      centerid: [this.centerid, Validators.required],
      remarks: [''],

      productarr: this._fb.array([])

    });


    this._route.params.subscribe(params => {
      this.centerid = currentUser.center_id;
      this.userid = currentUser.userid;

      this.init();
      this._cdr.markForCheck();
    });

  }

  get productarr(): FormGroup {
    return this.submitForm.get('productarr') as FormGroup;
  }

  onFocus() {
    console.log('onFocus');

  }

  ngOnInit() {
  }

  init() {



    this.customerData = "";
    this.customerAdded = false;


    this.addProduct();
    this.addProduct();
    this.addProduct();
    this.addProduct();
    this.addProduct();




    this.submitForm.patchValue({
      centerid: this.centerid,
    });



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




  addProduct() {
    const control = <FormArray>this.submitForm.controls['productarr'];
    control.push(this.initProduct());
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


  ionViewDidEnter() {
    // this.firstenquiry.nativeElement.focus();
  }


  // onAddProduct() {

  //   this.currentcount = this.currentcount++;

  //   const control = new FormGroup({
  //     'notes': new FormControl(null, Validators.required),
  //     'quantity': new FormControl(1, Validators.required),
  //   });

  //   (<FormArray>this.submitForm.get('productarr')).push(control);

  //   this._cdr.markForCheck();

  // }



  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {


          // const faControl = 
          // (<FormArray>this.pmForm.controls['bundleDetails']).at(index);
          // faControl['controls'].bsku.setValue(sku);


          const faControl =
            (<FormArray>this.submitForm.controls['productarr']).at(idx);
          faControl['controls'].quantity.setValue(data);




        }

        this._cdr.markForCheck();
      }
    );
  }

  onSubmit() {

    console.log('did this submitte?');

    console.log('object...' + this.submitForm.value);

    this._commonApiService.saveEnquiry(this.submitForm.value).subscribe((data: any) => {
      console.log('object.SAVE ENQ. ' + JSON.stringify(data));

      if (data.body.result === 'success') {

        this.submitForm.reset();
        this.myForm.resetForm();

        this._router.navigate([`/home/enquiry/open-enquiry`]);

      } else {

      }

      this._cdr.markForCheck();
    });

  }



  async showAllCustomersComp() {

    const modal = await this._modalcontroller.create({
      component: ShowCustomersComponent,
      componentProps: {},
      cssClass: 'customer-comp-styl'

    });


    modal.onDidDismiss().then((result) => {
      let custData = result.data;

      if (custData !== undefined) {
        this.customerAdded = true;


        this.submitForm.patchValue({
          customer: custData,
        });

        this.customerData = custData;
      }



      this._cdr.markForCheck();

    })

    await modal.present();
  }

  openEnquiry() {
    this._router.navigateByUrl('/home/enquiry/open-enquiry');
  }

  openBackOrder() {
    this._router.navigateByUrl('/home/enquiry/back-order');
  }

}
