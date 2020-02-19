import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.page.html',
  styleUrls: ['./view-vendors.page.scss'],
})
export class ViewVendorsPage implements OnInit {

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService,
    private _router: Router, ) {
    const currentUser = this._authservice.currentUserValue;
    if (currentUser) {
      console.log('will it work >> ' + JSON.stringify(currentUser));

    }
  }

  ngOnInit() {

    // this._commonApiService.getAllActiveVendors(this.center_id).subscribe((data: any) => {

    // });
  }

}
