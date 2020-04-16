import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ShowCustomersComponent } from 'src/app/components/show-customers/show-customers.component';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CurrencyPadComponent } from 'src/app/components/currency-pad/currency-pad.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.page.html',
  styleUrls: ['./accounts-receivable.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsReceivablePage implements OnInit {
  customerAdded = false;
  submitForm: FormGroup;
  customerData: any;

  removeRowArr = [];
  showDelIcon = false;
  // currentcount = 0;

  maxDate = new Date();
  userid: any;
  centerid: any;

  pymtmodes = [
    { key: 'NEFT', viewValue: 'NEFT' },
    { key: 'CASH', viewValue: 'CASH' }
  ];


  constructor(private _fb: FormBuilder, public dialog: MatDialog, private _authservice: AuthenticationService,
    private _modalcontroller: ModalController, private _router: Router,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService
  ) {
    const currentUser = this._authservice.currentUserValue;
    this.centerid = currentUser.center_id;
    this.userid = currentUser.userid;
  }

  ngOnInit() {
    this.submitForm = this._fb.group({
      customer: [null, Validators.required],
      centerid: [this.centerid, Validators.required],
      accountarr: this._fb.array([])

    });

    this.addAccount();

  }

  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {


          // const faControl = 
          // (<FormArray>this.pmForm.controls['bundleDetails']).at(index);
          // faControl['controls'].bsku.setValue(sku);


          const faControl =
            (<FormArray>this.submitForm.controls['accountarr']).at(idx);
          faControl['controls'].receivedamount.setValue(data);




        }

        this._cdr.markForCheck();
      }
    );
  }



  initAccount() {
    return this._fb.group({
      checkbox: [false],
      receivedamount: ['', Validators.required],
      receiveddate: ['', Validators.required],
      pymtmode: ['', Validators.required],
      bankref: [''],
      gnrlref: [''],


    });
  }

  get accountarr(): FormGroup {
    return this.submitForm.get('accountarr') as FormGroup;
  }

  addAccount() {
    // this.currentcount = this.currentcount++;
    const control = <FormArray>this.submitForm.controls['accountarr'];
    control.push(this.initAccount());
    this._cdr.markForCheck();

  }


  onRemoveRows() {

    this.removeRowArr.sort().reverse();

    this.removeRowArr.forEach((idx) => {

      this.onRemoveAccount(idx);
    });

    this.removeRowArr = [];

  }

  onRemoveAccount(idx) {

    console.log('On Remove Account Function >> ' + this.removeRowArr);

    (<FormArray>this.submitForm.get('accountarr')).removeAt(idx);

  }

  checkedRow(idx: number) {

    const faControl =
      (<FormArray>this.submitForm.controls['accountarr']).at(idx);
    faControl['controls'].checkbox;

    if (!faControl.value.checkbox) {
      this.removeRowArr.push(idx);
    } else {
      this.removeRowArr = this.removeRowArr.filter(e => e !== idx);
    }
    this.delIconStatus();
    console.log('Array after Check Box..' + this.removeRowArr);

  }


  delIconStatus() {
    if (this.removeRowArr.length > 0) {
      this.showDelIcon = true;
    } else {
      this.showDelIcon = false;
    }
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

  onSubmit() {

    console.log('did this submitte?');

    console.log('object...' + this.submitForm.value);

    this._commonApiService.addAccountReceived(this.submitForm.value).subscribe((data: any) => {
      console.log('object.SAVE ENQ. ' + JSON.stringify(data));

      if (data.body.result === 'success') {

        this.submitForm.reset();
        console.log('object...SUCCESS..')

        this._router.navigate([`/home/accounts/accounts-dash`]);

      } else {

      }

      this._cdr.markForCheck();
    });

  }

  // fromDateSelected($event) {
  //   this.fromdate = $event.target.value;
  // }

}
