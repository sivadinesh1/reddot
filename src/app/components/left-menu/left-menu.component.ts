import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { onSideNavChange, animateText } from '../../util/animations';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { User } from 'src/app/models/User';



interface Page {
  link: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
  animations: [onSideNavChange, animateText],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftMenuComponent implements OnInit {

  public sideNavState: boolean = false;
  public linkText: boolean = false;
  clickedItem: any;

  clickedMenudata$: Observable<any>;
  userdata$: Observable<User>;
  userdata: any;

  pages: Page[] = [
    { name: 'Enquiry', link: '/home/enquiry/open-enquiry', icon: '/assets/svg/enquiry.svg' },
    { name: 'Sale', link: '/home/search-sales', icon: '/assets/svg/sales.svg' },
    { name: 'Purchase', link: '/home/search-purchase', icon: '/assets/svg/purchase.svg' },
    { name: 'Payments', link: '/home/payments', icon: '/assets/svg/money.svg' },
    // { name: 'Accounts', link: '/home/accounts-payments', icon: '/assets/svg/money.svg' },

  ];


  constructor(private _sidenavService: SidenavService, private _authservice: AuthenticationService,
    private _router: Router,
    private _cdr: ChangeDetectorRef) {

    this.clickedMenudata$ = this._authservice.currentMenu;

    this.clickedMenudata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.clickedItem = data;


        this._cdr.markForCheck();
      });

    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this._cdr.markForCheck();
      });


  }

  ngOnInit() {
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState

    setTimeout(() => {
      this.linkText = this.sideNavState;
      this._cdr.detectChanges();
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState);
    this._cdr.detectChanges();
  }



  routeTo(name: string, url: string) {
    this._authservice.setCurrentMenu(name);

    this.clickedItem = name;
    this._router.navigateByUrl(url);
    this._cdr.markForCheck();
  }

  routeToDashboard() {

    if (this.userdata.role === 'ADMIN') {
      this.clickedItem = "dashboard";
      this._router.navigateByUrl("/home/admin-dashboard");
      this._cdr.markForCheck();
    } else {
      this.clickedItem = "dashboard";
      this._router.navigateByUrl("home/dashboard");
      this._cdr.markForCheck();
    }
  }

}

