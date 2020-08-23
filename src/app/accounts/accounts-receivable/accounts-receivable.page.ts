import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ShowCustomersComponent } from 'src/app/components/show-customers/show-customers.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CurrencyPadComponent } from 'src/app/components/currency-pad/currency-pad.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { filter } from 'rxjs/operators';

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

  maxDate = new Date();


  pymtmodes$: Observable<any>;
  userdata: any;

  userdata$: Observable<User>;

  constructor(private _fb: FormBuilder, public dialog: MatDialog, private _authservice: AuthenticationService,
    private _modalcontroller: ModalController, private _router: Router, private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService
  ) {
    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.init();
        this._cdr.markForCheck();
      });


    this._route.params.subscribe(params => {
      if (this.userdata !== undefined) {
        this.init();
      }
    });



  }

  async init() {
    this.pymtmodes$ = this._commonApiService.getAllActivePymtModes(this.userdata.center_id, "A");
  }

  ngOnInit() {
    this.submitForm = this._fb.group({
      customer: [null, Validators.required],
      centerid: [this.userdata.center_id, Validators.required],
      accountarr: this._fb.array([])

    });

    this.addAccount();

  }

  // openCurrencyPad(idx) {

  //   const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

  //   dialogRef.afterClosed().subscribe(
  //     data => {
  //       if (data != undefined && data.length > 0 && data != 0) {

  //         const faControl =
  //           (<FormArray>this.submitForm.controls['accountarr']).at(idx);
  //         faControl['controls'].receivedamount.setValue(data);




  //       }

  //       this._cdr.markForCheck();
  //     }
  //   );
  // }



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

    this._commonApiService.addPymtReceived(this.submitForm.value).subscribe((data: any) => {
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

}
