import { Router } from '@angular/router';
import { CommonApiService } from './../services/common-api.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab1Page implements OnInit {

  enquiryList: any;

  constructor(private _commonApiService: CommonApiService,
    private _router: Router,

    private _cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this._commonApiService.getAllActiveEnquiries().subscribe(
      data => {
        this.enquiryList = data;
        this._cdr.markForCheck();
      }
    );
  }



  goBillingPage(item) {
    console.log('object' + item.id);

    const myurl = `billing/${item.id}`;
    this._router.navigateByUrl(myurl).then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });
  }


  goPurchaseScreen() {
    this._router.navigateByUrl(`/purchase`);
  }

}
