import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  userdata: any;
  center_id: any;


  @Input() sidenav: MatSidenav

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _router: Router) {
    // const currentUser = this._authservice.currentUserValue;
    // this.center_id = currentUser.center_id;
  }

  ngOnInit() {
    this.userdata = this._authservice.currentUserValue;
  }

  toggle() {
    this.sidenav.toggle();
    this._cdr.markForCheck();
  }


  goAdmin() {
    this._router.navigate([`/home/admin`]);
  }


  async logout() {
    await this._authservice.logOut();
    this._router.navigateByUrl('');
  }


  viewProduct() {
    this._router.navigate([`/home/view-products`]);
  }

  viewVendor() {
    this._router.navigate([`/home/view-vendors`]);
  }

  viewCustomer() {
    this._router.navigate([`/home/view-customers`]);
  }

  editCenter() {
    this._router.navigate([`/home/center/edit`, this.center_id]);
  }

  openBackOrder() {
    this._router.navigateByUrl('/home/enquiry/back-order');
  }

}