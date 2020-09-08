import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { AuthenticationService } from '../../services/authentication.service';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Purchase } from '../../models/Purchase';
import { Vendor } from 'src/app/models/Vendor';
import { AlertController } from '@ionic/angular';

import { filter, map, startWith } from 'rxjs/operators';
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-search-purchase',
  templateUrl: './search-purchase.page.html',
  styleUrls: ['./search-purchase.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPurchasePage implements OnInit {

  purchases$: Observable<Purchase[]>;
  vendor$: Observable<Vendor[]>;

  resultList: any;
  vendorList: any;
  // center_id: any;

  statusFlag = 'D';
  selectedVend = 'all';

  today = new Date();
  submitForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  dobMaxDate = new Date();
  statusList = [{ "id": "all", "value": "All" }, { "id": "D", "value": "Draft" }, { "id": "C", "value": "Completed" }]

  fromdate = new Date();
  todate = new Date();

  sumTotalValue = 0.00;
  sumNumItems = 0;
  // uniqCustCount = 0;

  purchase$: Observable<Purchase[]>;

  draftPurchase$: Observable<Purchase[]>;
  fullfilledPurchase$: Observable<Purchase[]>;

  filteredPurchase$: Observable<Purchase[]>;
  userdata$: Observable<User>;
  userdata: any;

  filteredValues: any;
  tabIndex = 0;

  filteredVendor: Observable<any[]>;
  vendor_lis: Vendor[];

  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,
    public alertController: AlertController,
    private _authservice: AuthenticationService) {

    const dateOffset = (24 * 60 * 60 * 1000) * 3;
    this.fromdate.setTime(this.minDate.getTime() - dateOffset);

    this.submitForm = this._fb.group({
      vendorid: ['all'],
      vendorctrl: ['All Vendors'],
      todate: [this.todate, Validators.required],
      fromdate: [this.fromdate, Validators.required],
      status: new FormControl('all'),
    })

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

  ngOnInit() {


  }

  async init() {
    this._commonApiService.getAllActiveVendors(this.userdata.center_id)
      .subscribe((data: any) => {
        this.vendor_lis = data;

        this.filteredVendor = this.submitForm.controls['vendorctrl'].valueChanges
          .pipe(
            startWith(''),
            map(vendor => vendor ? this.filtervendor(vendor) : this.vendor_lis.slice())
          );

        this.search();
        this._cdr.markForCheck();
      });

  }


  filtervendor(value: any) {

    if (typeof (value) == "object") {
      return this.vendor_lis.filter(vendor =>
        vendor.name.toLowerCase().indexOf(value.name.toLowerCase()) === 0);
    } else if (typeof (value) == "string") {
      return this.vendor_lis.filter(vendor =>
        vendor.name.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

  }

  getPosts(event) {
    this.submitForm.patchValue({
      vendorid: event.option.value.id,
      vendorctrl: event.option.value.name
    });

    this.tabIndex = 0;
    this._cdr.markForCheck();

    this.search();
  }


  clearInput() {
    this.submitForm.patchValue({
      vendorid: 'all',
      vendorctrl: 'All Customers'
    });
    this._cdr.markForCheck();
    this.search();
  }

  async search() {
    this.purchases$ = this._commonApiService
      .searchPurchases(this.userdata.center_id, this.submitForm.value.vendorid,
        this.submitForm.value.status,
        this.submitForm.value.fromdate,
        this.submitForm.value.todate,

      );

    this.filteredPurchase$ = this.purchases$;

    // for initial load of first tab (ALL)
    this.filteredValues = await this.filteredPurchase$.toPromise();


    // to calculate the count on each status    
    this.draftPurchase$ = this.purchases$.pipe(map((arr: any) => arr.filter(f => f.status === 'D')));
    this.fullfilledPurchase$ = this.purchases$.pipe(map((arr: any) => arr.filter(f => f.status === 'C')));
    this.calculateSumTotals();
    this.tabIndex = 0;
    this._cdr.markForCheck();


  }

  goPurchaseEditScreen(item) {
    if (item.status === 'C') {
      this.editCompletedPurchaseConfirm(item);
    } else {
      this._router.navigateByUrl(`/home/purchase/edit/${item.id}`);
    }

  }

  goPurchaseAddScreen() {
    this._router.navigateByUrl(`/home/purchase/edit/0`);
  }

  statusChange($event) {
    this.statusChange = $event.source.value;
  }

  selectedVendor($event) {
    this.selectedVend = $event.source.value;
  }

  toDateSelected($event) {
    this.todate = $event.target.value;
  }

  fromDateSelected($event) {
    this.fromdate = $event.target.value;
  }

  // delete(item) {
  //   this._commonApiService.deletePurchaseData(item.id).subscribe((data: any) => {
  //     this.init();

  //   })
  // }

  delete(item) {
    this._commonApiService.deletePurchaseData(item.id).subscribe((data: any) => {

      if (data.result === 'success') {
        this._commonApiService.deletePurchaseMaster(item.id).subscribe((data1: any) => {
          this.init();
        });
      }


    })
  }


  async presentAlertConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.delete(item);
          }
        }
      ]
    });

    await alert.present();
  }

  async tabClick($event) {
    let value = await this.filteredPurchase$.toPromise();

    if ($event.index === 0) {
      this.filteredValues = value.filter((data: any) => (data.status === 'D' || data.status === 'C'));
    } else if ($event.index === 1) {
      this.filteredValues = value.filter((data: any) => data.status === 'D');
    } else if ($event.index === 2) {
      this.filteredValues = value.filter((data: any) => data.status === 'C');
    }

    this.calculateSumTotals();
    this._cdr.markForCheck();

  }


  calculateSumTotals() {
    this.sumTotalValue = 0.00;
    this.sumNumItems = 0;

    this.sumTotalValue = this.filteredValues.map(item => {
      return item.total_value;
    })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);


    this.sumNumItems = this.filteredValues.map(item => {
      return item.no_of_items;
    })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // DnD - How to count string result set (count of unique vendor names)
    // this.uniqCustCount = this.filteredValues.map(item => {
    //   return item.vendor_name;
    // }).filter(function (val, i, arr) {
    //   return arr.indexOf(val) === i;
    // }).length;

  }


  async editCompletedPurchaseConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Editing completed purchase, Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Go to purchase screen',
          handler: () => {
            console.log('Confirm Okay');
            this._router.navigateByUrl(`/home/purchase/edit/${item.id}`);

          }
        }
      ]
    });

    await alert.present();
  }


}
