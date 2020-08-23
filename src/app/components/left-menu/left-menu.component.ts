import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { onSideNavChange, animateText } from '../../util/animations';
import { SidenavService } from 'src/app/services/sidenav.service';
import { Router } from '@angular/router';



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
  clickedItem = 'dashboard';

  pages: Page[] = [
    { name: 'Enquiry', link: '/home/enquiry/open-enquiry', icon: '/assets/svg/enquiry.svg' },
    { name: 'Sale', link: '/home/search-sales', icon: '/assets/svg/sales.svg' },
    { name: 'Purchase', link: '/home/search-purchase', icon: '/assets/svg/purchase.svg' },
    { name: 'Payments', link: '/home/payments', icon: '/assets/svg/money.svg' },

  ];


  constructor(private _sidenavService: SidenavService,
    private _router: Router,
    private _cdr: ChangeDetectorRef) { }

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
    this.clickedItem = name;
    this._router.navigateByUrl(url);
    this._cdr.markForCheck();
  }

}

