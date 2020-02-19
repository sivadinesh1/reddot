import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

import { filter } from 'rxjs/operators';

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

  navigationSubscription: any;


  test: any;

  constructor(private _commonApiService: CommonApiService, private _router: Router,
    private _authservice: AuthenticationService,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef) {

    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;



    this._route.params.subscribe(params => {
      this.initialise();
    });

  }

  ngOnInit() {

    //  this.center_name = this._authservice.center;


  }

  initialise() {
    // Status o - open
    this._commonApiService.getOpenEnquiries(this.center_id, 'O').subscribe((data: any) => {
      this.openenq = data;

      this._cdr.markForCheck();
    });

    // status p - order processed
    this._commonApiService.getOpenEnquiries(this.center_id, 'P').subscribe((data: any) => {
      this.readyforsale = data;

      this._cdr.markForCheck();
    });
  }


  processEnquiry(item) {
    this._router.navigate(['/home/enquiry/process-enquiry', item.id]);
  }


  moveToSale(item) {
    this._router.navigate(['/home/sales', item.id]);
  }

  logout() {

  }


  goEnquiryScreen() {
    this._router.navigateByUrl(`/home/enquiry`);
  }

}
