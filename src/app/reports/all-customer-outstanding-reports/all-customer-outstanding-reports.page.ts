import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/User';
import { CommonApiService } from '../../services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, tap, map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
	selector: 'app-all-customer-outstanding-reports',
	templateUrl: './all-customer-outstanding-reports.page.html',
	styleUrls: ['./all-customer-outstanding-reports.page.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllCustomerOutstandingReportsPage implements OnInit {
	userdata$: Observable<User>;
	outstandingBalanceList: any;
	userdata: any;

	constructor(
		private _authservice: AuthenticationService,
		private _commonApiService: CommonApiService,
		private _cdr: ChangeDetectorRef,
		private _router: Router
	) {
		this.userdata$ = this._authservice.currentUser;
		this.userdata$.pipe(filter((data) => data !== null)).subscribe((data: any) => {
			this._authservice.setCurrentMenu('REPORTS');
			this.userdata = data;

			this.init();

			this._cdr.markForCheck();
		});
	}

	ngOnInit() {}

	init() {
		this.reloadOutstandingBalance();
	}

	reloadOutstandingBalance() {
		this._commonApiService.getOutstandingBalance({ center_id: this.userdata.center_id, limit: 0 }).subscribe((data: any) => {
			this.outstandingBalanceList = data.body;

			this._cdr.markForCheck();
		});

		this._cdr.markForCheck();
	}

	goCustomerFinancials(customer_id) {
		this._router.navigate([`/home/financials-customer/${this.userdata.center_id}/${customer_id}`]);
	}
}
