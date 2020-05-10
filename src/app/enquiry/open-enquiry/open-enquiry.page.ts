import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

import { Customer } from 'src/app/models/Customer';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Enquiry } from 'src/app/models/Enquiry';

@Component({
  selector: 'app-open-enquiry',
  templateUrl: './open-enquiry.page.html',
  styleUrls: ['./open-enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenEnquiryPage implements OnInit {

  openenq: any;

  readyforsale: any;
  center_name: string;
  center_id: any;

  statusFlag = 'O';
  selectedCust = 'all';

  today = new Date();
  submitForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();

  fromdate = new Date();
  todate = new Date();

  statusList = [{ "id": "O", "value": "Enquiry-New" }, { "id": "D", "value": "Enquiry-Cart" },
  { "id": "P", "value": "Enquiry-Ready for Invoice" },
  { "id": "E", "value": "Enquiry-Closed" }
  ]

  navigationSubscription: any;
  customer$: Observable<Customer[]>;
  enquiries$: Observable<Enquiry[]>;

  test: any;

  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,

    private _authservice: AuthenticationService,

  ) {

    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

    const dateOffset = (24 * 60 * 60 * 1000) * 3;
    this.fromdate.setTime(this.minDate.getTime() - dateOffset);

    this._route.params.subscribe(params => {
      this.init();
    });

  }

  ngOnInit() {

    //   this.init();


  }

  init() {
    this.customer$ = this._commonApiService.getAllActiveCustomers(this.center_id);

    this.submitForm = this._fb.group({
      customerid: new FormControl('all'),
      todate: [this.todate, Validators.required],
      fromdate: [this.fromdate, Validators.required],
      status: new FormControl('O'),
    })

    this.search();
    this._cdr.markForCheck();

  }

  search() {
    this.enquiries$ = this._commonApiService
      .searchEnquiries(this.center_id, this.submitForm.value.customerid,
        this.submitForm.value.status,
        this.submitForm.value.fromdate,
        this.submitForm.value.todate,

      );

    this._cdr.markForCheck();
  }

  fromDateSelected($event) {
    this.fromdate = $event.target.value;
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


}
