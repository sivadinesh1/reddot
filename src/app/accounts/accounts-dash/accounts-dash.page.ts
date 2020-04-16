import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-accounts-dash',
  templateUrl: './accounts-dash.page.html',
  styleUrls: ['./accounts-dash.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsDashPage implements OnInit {
  centerid: any;
  resultList: any;

  constructor(private _router: Router, private _cdr: ChangeDetectorRef,
    private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService) {
    const currentUser = this._authservice.currentUserValue;
    this.centerid = currentUser.center_id;
  }

  ngOnInit() {

    this._commonApiService.getAccountsReceivable(this.centerid).subscribe((data: any) => {
      this.resultList = data;
      this._cdr.markForCheck();

    });
  }

  goAccountsReceivables() {
    this._router.navigateByUrl(`/home/accounts/accounts-receivable`);
  }

}
