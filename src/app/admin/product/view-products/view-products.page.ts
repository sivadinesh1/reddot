
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { AuthenticationService } from '../../../services/authentication.service';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { User } from "../../../models/User";

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.page.html',
  styleUrls: ['./view-products.page.scss'],
})
export class ViewProductsPage implements OnInit {

  productinfo: any;

  center_id: any;

  pcount: any;


  resultList: any;
  noMatch: any;

  customer_id;

  order_date;

  userdata$: Observable<User>;
  userdata: any;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;



  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _route: ActivatedRoute, private _router: Router, private _authservice: AuthenticationService
  ) {

    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.center_id = this.userdata.center_id;

        this._cdr.markForCheck();
      });




  }

  ngOnInit() {
    this.productinfo = this._commonApiService
      .viewProductsCount(this.center_id).subscribe((data: any) => {

        this.pcount = data[0].count || 0;

        this._cdr.markForCheck();
      });
  }

  addProduct() {
    this._router.navigate([`/home/product/add`]);
  }

  editProduct(item) {
    this._router.navigateByUrl(`/home/product/edit/${this.center_id}/${item.product_id}`);
  }

  ionViewDidEnter() {
    this.searchbar.setFocus();
  }


  openDialog(searchstring): void {


    if (searchstring.length > 2) {

      this._commonApiService.getProductInfo({ "centerid": this.center_id, "searchstring": searchstring }).subscribe(
        data => {
          this.resultList = data.body;
          // console.log('ABCD >> ' + JSON.stringify(this.resultList));
          if (this.resultList.length === 0) {

            this.noMatch = 'No Matching Records';
            this._cdr.markForCheck();

          } else if (this.resultList.length > 0) {
            this.noMatch = '';
            this._cdr.markForCheck();
          }

        });

    }
  }

  reset() {
    this.searchbar.value = '';
    this.noMatch = '';
    this.resultList = null;
  }


}
