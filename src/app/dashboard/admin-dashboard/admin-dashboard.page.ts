import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonApiService } from '../../services/common-api.service';
import { filter, tap, debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { User } from '../../models/User';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardPage implements OnInit {
  userdata$: Observable<User>;
  userdata: any;
  userid: any;
  enquirySummary: any;
  salesSummary: any;
  purchaseSummary: any;
  salesTotal: any;
  centerSummary: any;
  centerReceivablesSummary: any;
  centerReceivablesTotal: any;
  paymentsArr: any;

  receivablesByCustomers: any;
  paymentsTotal: any;
  yearly_turnover: any;
  selectedOption = "today";

  iscustomenquiry = false;

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService, private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,) {

    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this._authservice.setCurrentMenu("Dashboard");
        this.userdata = data;
        this.reloadInquirySummary("today");
        this.reloadSalesSummary();
        this.reloadPurchaseSummary();
        this.reloadSalesTotal(moment().format('DD-MM-YYYY'), moment().format('DD-MM-YYYY'), "today");
        this.reloadSalesTotal(moment().startOf('year').format('DD-MM-YYYY'), moment().format('DD-MM-YYYY'), "yearly");
        this.reloadCenterSummary();
        this.reloadCenterReceivablesSummary();
        this.reloadPaymentsByCustomer();
        this._cdr.markForCheck();
      });

  }

  ngOnInit() {
    this.userid = this._route.snapshot.params['userid'];
  }

  customEnquiry() {
    this.iscustomenquiry = !this.iscustomenquiry;
  }

  reloadInquirySummary(param) {

    let from_date = "";

    if (param === "weekly") {
      from_date = moment().startOf('isoWeek').format('DD-MM-YYYY');
      this.selectedOption = "weekly";
    } else if (param === "monthly") {
      from_date = moment().startOf('month').format('DD-MM-YYYY');
      this.selectedOption = "monthly";
    } else if (param === "yearly") {
      from_date = moment().startOf('year').format('DD-MM-YYYY');
      this.selectedOption = "yearly";
    } else if (param === "today") {
      from_date = moment().format('DD-MM-YYYY');
      this.selectedOption = "today";
    }


    let obj = {
      "center_id": this.userdata.center_id,
      "from_date": from_date,
      "to_date": moment().format('DD-MM-YYYY')
    }
    debugger;
    this._commonApiService.fetchInquirySummary(obj).subscribe((data: any) => {
      this.enquirySummary = data.body[0];
      this._cdr.markForCheck();
    });

    this._cdr.markForCheck();
  }

  reloadSalesSummary() {

    this._commonApiService.fetchSalesSummary(
      { "center_id": this.userdata.center_id, "from_date": moment().format('DD-MM-YYYY'), "to_date": moment().format('DD-MM-YYYY') })
      .subscribe((data: any) => {


        this.salesSummary = data.body[0];
        this._cdr.markForCheck();
      });

    this._cdr.markForCheck();
  }

  reloadPurchaseSummary() {

    this._commonApiService.fetchPurchaseSummary(
      { "center_id": this.userdata.center_id, "from_date": moment().format('DD-MM-YYYY'), "to_date": moment().format('DD-MM-YYYY') })
      .subscribe((data: any) => {


        this.purchaseSummary = data.body[0];
        this._cdr.markForCheck();
      });

    this._cdr.markForCheck();
  }

  reloadSalesTotal(from, to, param) {

    this._commonApiService.fetchSalesTotal(
      { "center_id": this.userdata.center_id, "from_date": from, "to_date": to })
      .subscribe((data: any) => {

        if (param === 'yearly') {
          this.yearly_turnover = data.body[0].sales_total;

        } else if (param === 'today') {
          this.salesTotal = data.body[0].sales_total;
        }


        this._cdr.markForCheck();
      });

    this._cdr.markForCheck();
  }

  reloadCenterSummary() {

    this._commonApiService.fetchCenterSummary(
      { "center_id": this.userdata.center_id, "from_date": moment().format('DD-MM-YYYY'), "to_date": moment().format('DD-MM-YYYY') })
      .subscribe((data: any) => {


        this.centerSummary = data.body[0];
        this._cdr.markForCheck();
      });

    this._cdr.markForCheck();
  }

  reloadCenterReceivablesSummary() {

    this._commonApiService.fetchCenterReceivablesSummary(
      { "center_id": this.userdata.center_id, "from_date": moment().format('DD-MM-YYYY'), "to_date": moment().format('DD-MM-YYYY') })
      .subscribe((data: any) => {


        this.centerReceivablesSummary = data.body;

        this.centerReceivablesTotal = this.centerReceivablesSummary.map(item => {
          return item.balance;
        })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);



        this.receivablesByCustomers = this.centerReceivablesSummary.filter(item => {
          return item.balance !== 0.00 || item.balance !== 0;
        })



        this._cdr.markForCheck();
      });

    this._cdr.markForCheck();
  }


  /**
   * Recent Payments by date range, and breakups by customers, drills down, when clicked by custoemrs
   */
  reloadPaymentsByCustomer() {

    this._commonApiService.fetchPaymentsByCustomer(
      { "center_id": this.userdata.center_id, "from_date": moment().format('DD-MM-YYYY'), "to_date": moment().format('DD-MM-YYYY') })
      .subscribe((data: any) => {


        this.paymentsArr = data.body;

        this.paymentsTotal = this.paymentsArr.map(item => {
          return item.payment_now_amt;
        })
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);





        this._cdr.markForCheck();
      });

    this._cdr.markForCheck();
  }





}
