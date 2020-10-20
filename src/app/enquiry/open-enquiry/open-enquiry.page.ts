import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

import { Customer } from 'src/app/models/Customer';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Enquiry } from 'src/app/models/Enquiry';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { Vendor } from 'src/app/models/Vendor';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { SuccessMessageDialogComponent } from 'src/app/components/success-message-dialog/success-message-dialog.component';
import { DeleteEnquiryDialogComponent } from 'src/app/components/delete-enquiry-dialog/delete-enquiry-dialog.component';
import { EnquiryViewDialogComponent } from '../../components/enquiry/enquiry-view-dialog/enquiry-view-dialog.component';
import { User } from 'src/app/models/User';
import * as moment from 'moment';

@Component({
  selector: 'app-open-enquiry',
  templateUrl: './open-enquiry.page.html',
  styleUrls: ['./open-enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenEnquiryPage implements OnInit {


  openenq: any;
  tabIndex = 0;

  readyforsale: any;
  center_name: string;
  // center_id: any;

  userdata$: Observable<User>;
  userdata: any;

  statusFlag = 'O';
  selectedCust = 'all';

  today = new Date();
  submitForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();

  fromdate = new Date();
  todate = new Date();

  filteredValues: any;
  timeline: any;

  statusList = [{ "id": "all", "value": "All" }, { "id": "O", "value": "New Inquiry" }, { "id": "D", "value": "In Progress" },
  { "id": "P", "value": "Ready to Invoice" },
  { "id": "E", "value": "Closed Inquiry" }, { "id": "X", "value": "Cancelled Inquiry" }
  ]

  navigationSubscription: any;
  customer$: Observable<Customer[]>;
  enquiries$: Observable<Enquiry[]>;

  draftEnquiries$: Observable<Enquiry[]>;
  newEnquiries$: Observable<Enquiry[]>;

  invoiceReadyEnquiries$: Observable<Enquiry[]>;
  fullfilledEnquiries$: Observable<Enquiry[]>;

  cancelledEnquiries$: Observable<Enquiry[]>;

  filteredEnquiries$: Observable<Enquiry[]>;

  test: any;

  filteredCustomer: Observable<any[]>;
  customer_lis: Customer[];

  status: any;

  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,
    private _dialog: MatDialog, private _authservice: AuthenticationService,

  ) {
    const weekOffset = (24 * 60 * 60 * 1000) * 7;
    const monthOffset = (24 * 60 * 60 * 1000) * 30;
    const yearOffset = (24 * 60 * 60 * 1000) * 365;

    this._route.params.subscribe(params => {
      // this.status = params['status'];
      // this.timeline = params['timeline'];

      // if (this.timeline === 'today') {
      //   this.fromdate = new Date();
      //   this.todate = new Date();
      // } else if (this.timeline === 'weekly') {
      //   this.fromdate.setTime(this.minDate.getTime() - weekOffset);
      //   this.todate = new Date();
      // } else if (this.timeline === 'monthly') {
      //   this.fromdate.setTime(this.minDate.getTime() - monthOffset);
      //   this.todate = new Date();
      // } else if (this.timeline === 'yearly') {
      //   this.fromdate.setTime(this.minDate.getTime() - yearOffset);
      //   this.todate = new Date();
      // }

      // if (this.status === 'O') {
      //   this.tabClick(0);
      //   this.tabIndex = 0;
      // } else if (this.status === 'D') {
      //   this.search();
      //   this.tabClick(1);
      //   this.tabIndex = 1;
      // } else if (this.status === 'P') {
      //   this.tabClick(2);
      //   this.tabIndex = 2;
      // } else if (this.status === 'E') {
      //   this.tabClick(3);
      //   this.tabIndex = 3;
      // }

      // this._cdr.markForCheck();
    });


    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.init();
        this._cdr.markForCheck();
      });

    const dateOffset = (24 * 60 * 60 * 1000) * 7;
    this.fromdate.setTime(this.minDate.getTime() - dateOffset);

    this._route.params.subscribe(params => {
      // this.tabIndex = 0;
      if (this.userdata !== undefined) {
        this.init();
      }

      this.status = params['status'];
      this.timeline = params['timeline'];

      if (this.timeline === 'today') {
        this.fromdate = new Date();
        this.todate = new Date();
      } else if (this.timeline === 'weekly') {
        this.fromdate.setTime(this.minDate.getTime() - weekOffset);
        this.todate = new Date();
      } else if (this.timeline === 'monthly') {
        this.fromdate.setTime(this.minDate.getTime() - monthOffset);
        this.todate = new Date();
      } else if (this.timeline === 'yearly') {
        this.fromdate.setTime(this.minDate.getTime() - yearOffset);
        this.todate = new Date();
      }

      if (this.status === 'O') {
        this.tabClick(0);
        this.tabIndex = 0;
      } else if (this.status === 'D') {
        this.search();
        this.tabClick(1);
        this.tabIndex = 1;
      } else if (this.status === 'P') {
        this.tabClick(2);
        this.tabIndex = 2;
      } else if (this.status === 'E') {
        this.tabClick(3);
        this.tabIndex = 3;
      }

      this._cdr.markForCheck();

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

  ngOnInit() {

  }

  async init() {

    this.submitForm = this._fb.group({
      customerid: ['all'],
      customerctrl: ['All Customers'],
      todate: [this.todate, Validators.required],
      fromdate: [this.fromdate, Validators.required],
      status: new FormControl('all'),
    })

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

  clearInput() {
    this.submitForm.patchValue({
      customerid: 'all',
      customerctrl: 'All Customers'
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


  }


  async search() {

    //main search
    this.enquiries$ = this._commonApiService
      .searchEnquiries(this.userdata.center_id, this.submitForm.value.customerid,
        this.submitForm.value.status,
        this.submitForm.value.fromdate,
        this.submitForm.value.todate,

      );

    this.filteredEnquiries$ = this.enquiries$;

    // for initial load of first tab (ALL)
    let value = await this.filteredEnquiries$.toPromise();

    this.filteredValues = value.filter((data: any) => data.estatus === 'O');

    // to calculate the count on each status    
    this.newEnquiries$ = this.enquiries$.pipe(map((arr: any) => arr.filter(f => f.estatus === 'O')));
    this.draftEnquiries$ = this.enquiries$.pipe(map((arr: any) => arr.filter(f => f.estatus === 'D')));
    this.invoiceReadyEnquiries$ = this.enquiries$.pipe(map((arr: any) => arr.filter(f => f.estatus === 'P')));
    this.fullfilledEnquiries$ = this.enquiries$.pipe(map((arr: any) => arr.filter(f => f.estatus === 'E')));
    this.cancelledEnquiries$ = this.enquiries$.pipe(map((arr: any) => arr.filter(f => f.estatus === 'X')));

    this._cdr.markForCheck();
  }

  fromDateSelected($event) {
    this.fromdate = $event.target.value;
    this.tabIndex = 0;

  }

  toDateSelected($event) {
    this.todate = $event.target.value;
    this.tabIndex = 0;

  }

  initialise() {
    // Status o - open
    // this._commonApiService.getOpenEnquiries(this.center_id, 'O').subscribe((data: any) => {
    //   this.openenq = data;

    //   this._cdr.markForCheck();
    // });

    // // status p - order processed
    // this._commonApiService.getOpenEnquiries(this.center_id, 'P').subscribe((data: any) => {
    //   this.readyforsale = data;

    //   this._cdr.markForCheck();
    // });
  }


  processEnquiry(item) {
    console.log('its getting called');
    this._router.navigate(['/home/enquiry/process-enquiry', item.id]);
  }


  moveToSale(item) {
    this._router.navigate([`/home/sales/enquiry/${item.id}`]);
  }

  logout() {

  }


  goEnquiryScreen() {
    this._router.navigateByUrl(`/home/enquiry`);
  }

  openBackOrder() {
    this._router.navigateByUrl('/home/enquiry/back-order');
  }

  statusChange($event) {
    this.statusChange = $event.source.value;
    this._cdr.markForCheck();
  }

  selectedCustomer($event) {
    this.selectedCust = $event.source.value;
  }

  async tabClick($event) {
    let value = await this.filteredEnquiries$.toPromise();


    if ($event.index === 0 || $event === 0) {
      this.filteredValues = value.filter((data: any) => data.estatus === 'O');
    } else if ($event.index === 1 || $event === 1) {
      this.filteredValues = value.filter((data: any) => data.estatus === 'D');
    } else if ($event.index === 2 || $event === 2) {
      this.filteredValues = value.filter((data: any) => data.estatus === 'P');
    } else if ($event.index === 3 || $event === 3) {
      this.filteredValues = value.filter((data: any) => data.estatus === 'E');
    } else if ($event.index === 4 || $event === 4) {
      this.filteredValues = value.filter((data: any) => data.estatus === 'X');
    }

    this._cdr.markForCheck();

  }



  delete(enquiry: Enquiry) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.height = "40%";
    dialogConfig.data = enquiry;


    const dialogRef = this._dialog.open(DeleteEnquiryDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.init();
          this._cdr.markForCheck();
        }
        )
      ).subscribe((data: any) => {
        if (data === 'success') {

          const dialogConfigSuccess = new MatDialogConfig();
          dialogConfigSuccess.disableClose = false;
          dialogConfigSuccess.autoFocus = true;
          dialogConfigSuccess.width = "25%";
          dialogConfigSuccess.height = "25%";
          dialogConfigSuccess.data = "Inquiry deleted and moved to cancelled status";

          const dialogRef = this._dialog.open(SuccessMessageDialogComponent, dialogConfigSuccess);

          this.init();

        }
      });



  }

  openDialog(row): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.height = "100%";
    dialogConfig.data = row;
    dialogConfig.position = { top: '0', right: '0' };

    const dialogRef = this._dialog.open(EnquiryViewDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}
