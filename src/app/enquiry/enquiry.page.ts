import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';
import { CommonApiService } from '../services/common-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.page.html',
  styleUrls: ['./enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnquiryPage implements OnInit {

  submitForm: FormGroup;
  currentcount = 0;
  customerAdded = false;
  customerData: any;

  // @ViewChild("firstenquiry", { static: false }) firstenquiry: ElementRef;

  constructor(private _fb: FormBuilder, public dialog: MatDialog,
    private _modalcontroller: ModalController, private _router: Router,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService
  ) {

  }

  get productarr(): FormGroup {
    return this.submitForm.get('productarr') as FormGroup;
  }

  onFocus() {
    console.log('onFocus');

  }

  ngOnInit() {


    this.submitForm = this._fb.group({
      customer: [null, Validators.required],
      centerid: [1, Validators.required],
      remarks: [''],

      productarr: this._fb.array([])


    });

    this.addProduct();
    this.addProduct();
    this.addProduct();

    this._cdr.markForCheck();

  }

  initProduct() {
    return this._fb.group({
      notes: ['', Validators.required],
      quantity: ['1'],

    });
  }

  addProduct() {
    this.currentcount = this.currentcount++;
    const control = <FormArray>this.submitForm.controls['productarr'];
    const productCtrl = this.initProduct();
    control.push(productCtrl);
  }


  onRemoveProduct(i) {
    (<FormArray>this.submitForm.get('productarr')).removeAt(i);
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
        console.log('object...SUCCESS..')

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
