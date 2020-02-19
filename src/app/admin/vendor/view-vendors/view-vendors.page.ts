import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar } from '@ionic/angular';
import { AdminMenuComponent } from 'src/app/components/admin-menu/admin-menu.component';

@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.page.html',
  styleUrls: ['./view-vendors.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewVendorsPage implements OnInit {

  center_id: any;
  resultList: any;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  @ViewChild(AdminMenuComponent, { static: true }) childComponentMenu: AdminMenuComponent;

  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService,
    private _router: Router, ) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;
  }

  ngOnInit() {

    this._commonApiService.getAllActiveVendors(this.center_id).subscribe((data: any) => {
      this.resultList = data;
      this._cdr.markForCheck();
    });
  }

  addVendor() {
    this._router.navigate([`/home/vendor/add`]);
  }

  editVendor(item) {
    this._router.navigate([`/home/vendor/edit`, this.center_id, item.id]);
  }

}
