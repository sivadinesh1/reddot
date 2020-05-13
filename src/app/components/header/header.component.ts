import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/User';
import { filter, map, defaultIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  userdata: any;


  userdata$: Observable<User>;

  @Input() sidenav: MatSidenav

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _router: Router) {

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
    this._router.navigate([`/home/center/edit`, this.userdata.center_id]);
  }



}