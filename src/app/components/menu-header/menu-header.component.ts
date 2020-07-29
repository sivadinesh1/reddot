import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent implements OnInit {


  userdata: any;
  center_id: any;

  constructor(private _authservice: AuthenticationService, private _router: Router) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;
  }

  ngOnInit() {


    this.userdata = this._authservice.currentUserValue;



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

  viewBrand() {
    this._router.navigate([`/home/view-brands`]);
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
