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

  pages: Page[] = [];

  admin_pages: Page[] = [
    { name: 'HOME', link: '/home/admin-dashboard', icon: '/assets/images/svg/dashboard-black.svg' },
    { name: 'ENQUIRY', link: '/home/enquiry/open-enquiry/O/weekly', icon: '/assets/images/svg/enquiry.svg' },
    { name: 'SALE', link: '/home/search-sales', icon: '/assets/images/svg/sales.svg' },
    { name: 'PURCHASE', link: '/home/search-purchase', icon: '/assets/images/svg/purchase.svg' },
    { name: 'PAYMENTS', link: '/home/payments', icon: '/assets/images/svg/money.svg' },
    { name: 'RETURNS', link: '/home/search-return-sales', icon: '/assets/images/svg/returning.svg' },

  ];

  user_pages: Page[] = [
    { name: 'HOME', link: '/home/dashboard', icon: '/assets/images/svg/dashboard-black.svg' },
    { name: 'ENQUIRY', link: '/home/enquiry/open-enquiry/O/weekly', icon: '/assets/images/svg/enquiry.svg' },
    { name: 'SALE', link: '/home/search-sales', icon: '/assets/images/svg/sales.svg' },
    { name: 'PURCHASE', link: '/home/search-purchase', icon: '/assets/images/svg/purchase.svg' },
    { name: 'RETURNS', link: '/home/search-return-sales', icon: '/assets/images/svg/returning.svg' },

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

  ngAfterViewInit(): void {
    if (this.userdata?.role === 'ADMIN') {
      this.pages = this.admin_pages;
    } else {
      this.pages = this.user_pages;
    }

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
    if (this.userdata.role === 'ADMIN' && this.clickedItem === 'HOME') {
      this._router.navigateByUrl("/home/admin-dashboard");
    } else {
      this._router.navigateByUrl(url);
    }


    this._cdr.markForCheck();
  }



}

