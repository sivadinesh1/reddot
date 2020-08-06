import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { AuthenticationService } from '../../services/authentication.service';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Sales } from '../../models/Sales';
import { Customer } from 'src/app/models/Customer';
import { AlertController } from '@ionic/angular';
import { filter, map, startWith } from 'rxjs/operators';
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-search-sales',
  templateUrl: './search-sales.page.html',
  styleUrls: ['./search-sales.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchSalesPage implements OnInit {

  sales$: Observable<Sales[]>;


  draftSales$: Observable<Sales[]>;
  fullfilledSales$: Observable<Sales[]>;

  filteredSales$: Observable<Sales[]>;

  filteredValues: any;
  tabIndex = 0;

  resultList: any;

  statusFlag = 'D';
  selectedCust = 'all';

  saletypeFlag = 'all';

  today = new Date();
  submitForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  dobMaxDate = new Date();

  fromdate = new Date();
  todate = new Date();

  filteredCustomer: Observable<any[]>;
  customer_lis: Customer[];

  userdata: any;

  userdata$: Observable<User>;

  statusList = [{ "id": "all", "value": "All" }, { "id": "D", "value": "Draft" },
  { "id": "C", "value": "Completed" }
  ]

  saletypeList = [{ "id": "all", "value": "All" }, { "id": "GI", "value": "Invoiced" },
  { "id": "SI", "value": "Stock Issued" }]

  sumTotalValue = 0.00;
  sumNumItems = 0;


  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,
    public alertController: AlertController,
    private _authservice: AuthenticationService) {

    this.submitForm = this._fb.group({
      customerid: ['all'],
      customerctrl: ['All Customers'],
      todate: [this.todate, Validators.required],
      fromdate: [this.fromdate, Validators.required],
      status: new FormControl('all'),
      saletype: new FormControl('all')
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

    const dateOffset = (24 * 60 * 60 * 1000) * 3;
    this.fromdate.setTime(this.minDate.getTime() - dateOffset);


    this._route.params.subscribe(params => {
      if (this.userdata !== undefined) {
        this.init();
      }
    });





  }



  filtercustomer(value: any) {

    if (typeof (value) == "object") {
      return this.customer_lis.filter(customer =>
        customer.name.toLowerCase().indexOf(value.name.toLowerCase()) === 0);
    } else if (typeof (value) == "string") {
      return this.customer_lis.filter(customer =>
        customer.name.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

  }



  async init() {



    this._commonApiService.getAllActiveCustomers(this.userdata.center_id).subscribe((data: any) => {
      this.customer_lis = data;

      this.filteredCustomer = this.submitForm.controls['customerctrl'].valueChanges
        .pipe(
          startWith(''),
          map(customer => customer ? this.filtercustomer(customer) : this.customer_lis.slice())
        );

    });



    this.search();
    this._cdr.markForCheck();

  }

  ngOnInit() {

  }

  clearInput() {
    this.submitForm.patchValue({
      customerid: 'all',
      customerctrl: ''
    });
    this._cdr.markForCheck();
    this.search();
  }

  getPosts(event) {
    this.submitForm.patchValue({
      customerid: event.option.value.id,
      customerctrl: event.option.value.name
    });

    this.tabIndex = 0;
    this._cdr.markForCheck();

    this.search();
  }


  async search() {

    this.sales$ = this._commonApiService
      .searchSales(this.userdata.center_id, this.submitForm.value.customerid,
        this.submitForm.value.status,
        this.submitForm.value.fromdate,
        this.submitForm.value.todate,
        this.submitForm.value.saletype
      );

    this.filteredSales$ = this.sales$;

    // for initial load of first tab (ALL)
    this.filteredValues = await this.filteredSales$.toPromise();





    // to calculate the count on each status    
    this.draftSales$ = this.sales$.pipe(map((arr: any) => arr.filter(f => f.status === 'D')));
    this.fullfilledSales$ = this.sales$.pipe(map((arr: any) => arr.filter(f => f.status === 'C')));
    this.calculateSumTotals();
    this.tabIndex = 0;
    this._cdr.markForCheck();

  }

  goSalesEditScreen(item) {
    if (item.status === 'C') {
      this.editCompletedSalesConfirm(item);
    } else {
      this._router.navigateByUrl(`/home/sales/edit/${item.id}`);
    }


  }

  goSalesAddScreen() {
    this._router.navigateByUrl(`/home/sales/edit/0`);
  }

  // statusChange($event) {
  //   this.statusChange = $event.source.value;
  // }

  // saletypeChange($event) {
  //   this.saletypeChange = $event.source.value;
  // }

  toDateSelected($event) {
    this.todate = $event.target.value;
    this.tabIndex = 0;
    this.search();
    this._cdr.markForCheck();
  }

  fromDateSelected($event) {
    this.fromdate = $event.target.value;
    this.tabIndex = 0;
    this.search();
    this._cdr.markForCheck();
  }

  delete(item) {
    this._commonApiService.deleteSaleData(item.id).subscribe((data: any) => {
      this.init();

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
            debugger;
            this.delete(item);
          }
        }
      ]
    });

    await alert.present();
  }

  async tabClick($event) {
    let value = await this.filteredSales$.toPromise();

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
  }



  async editCompletedSalesConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Editing completed sales, Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Go to sales screen',
          handler: () => {
            console.log('Confirm Okay');
            this._router.navigateByUrl(`/home/sales/edit/${item.id}`);

          }
        }
      ]
    });

    await alert.present();
  }


}
