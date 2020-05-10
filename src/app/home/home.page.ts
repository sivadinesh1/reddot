import { Component, ViewChild, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../components/loading/loading.service';
import { MessagesService } from '../components/messages/messages.service';
import { MatSidenav } from '@angular/material';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { SidenavService } from '../services/sidenav.service';
import { onMainContentChange } from '../util/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [
    LoadingService,
    MessagesService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [onMainContentChange]
})
export class HomePage implements OnInit {
  // @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  // isExpanded = false;
  // showSubmenu: boolean = false;
  // isShowing = false;
  // showSubSubMenu: boolean = false;

  userdata: any;
  center_id: any;
  // selectedMenu = 'dashboard';

  name = 'Angular';
  public onSideNavChange: boolean;

  constructor(private _authservice: AuthenticationService,
    private _cdr: ChangeDetectorRef, private _sidenavService: SidenavService,
    private _router: Router) {
    //  const currentUser = this._authservice.currentUserValue;
    // this.center_id = currentUser.center_id;

    this._sidenavService.sideNavState$.subscribe(res => {
      console.log(res)
      this.onSideNavChange = res;
    })


  }


  ngOnInit() {


    // this.userdata = this._authservice.currentUserValue;



  }


  // mouseenter() {
  //   if (!this.isExpanded) {
  //     this.isShowing = true;
  //   }
  // }

  // mouseleave() {
  //   if (!this.isExpanded) {
  //     this.isShowing = false;
  //   }
  // }


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


  // chooseMenu(item) {

  //   if (item === this.selectedMenu) {
  //     return "menuhover";
  //   }

  // }






  dashboard() {
    //   this.selectedMenu = 'dashboard';
    this._router.navigateByUrl(`/home/dashboard/admin-dashboard/${this.userdata.userid}`);
  }


  goPurchaseScreen() {
    //   this.selectedMenu = 'purchase';
    this._router.navigateByUrl(`/home/purchase`);
  }

  goSearchPurchaseScreen() {
    // this.selectedMenu = 'purchase';
    this._router.navigateByUrl(`/home/search-purchase`);
  }

  goSalesScreen() {
    //  this.selectedMenu = 'sales';
    // this._router.navigateByUrl(`/home/sales/0`);
    this._router.navigateByUrl(`/home/search-sales`);
  }

  goEnquiryScreen() {
    //  this.selectedMenu = 'enquiry';
    this._router.navigateByUrl(`/home/search-purchase`);
  }

  goOpenEquiries() {
    this._router.navigateByUrl(`/home/enquiry/open-enquiry`);
  }

  goAccountsScreen() {
    this._router.navigateByUrl(`/home/accounts/accounts-dash`);
  }

}
