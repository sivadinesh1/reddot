import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {

  userdata: any;

  selectedMenu = 'dashboard';

  // center_name: string;
  constructor(private _authservice: AuthenticationService,
    private _cdr: ChangeDetectorRef,
    private _router: Router) { }

  ngOnInit() {


    this.userdata = this._authservice.currentUserValue;


  }


  chooseMenu(item) {

    if (item === this.selectedMenu) {
      return "menuhover";
    }

  }




  async logout() {
    await this._authservice.logOut();
    this._router.navigateByUrl('');
  }

  dashboard() {
    this.selectedMenu = 'dashboard';
    this._router.navigateByUrl(`/home/dashboard/admin-dashboard/${this.userdata.userid}`);
  }


  goPurchaseScreen() {
    this.selectedMenu = 'purchase';
    this._router.navigateByUrl(`/home/purchase`);
  }

  goSalesScreen() {
    this.selectedMenu = 'sales';
    this._router.navigateByUrl(`/home/sales/0`);
  }

  goEnquiryScreen() {
    this.selectedMenu = 'enquiry';
    this._router.navigateByUrl(`/home/enquiry`);
  }

  goOpenEquiries() {
    this._router.navigateByUrl(`/home/enquiry/open-enquiry`);
  }

}
