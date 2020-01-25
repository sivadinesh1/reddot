
import { IonSearchbar, ModalController } from '@ionic/angular';

import { CommonApiService } from '../services/common-api.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage implements OnInit {

  resultList: any;
  origResultList: any;
  member404: any;
  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private modalController: ModalController, private _cartservice: CartService,
    private commonApiService: CommonApiService) { }

  ngOnInit() {
    this.getAsyncData();
  }

  async getAsyncData() {
    //  this.resultList = await this.commonApiService.getAllPartsStockData().toPromise();
    this.origResultList = this.resultList;
    //   console.log('.........' + JSON.stringify(this.resultList));
    this._cdr.markForCheck();
  }


  applyFilter(filterValue: string) {
    this.member404 = null;

    if (filterValue.length > 4) {

      this.resultList = this.origResultList;
      filterValue = filterValue.trim();
      //     console.log('object' + filterValue);
      // console.log('.........' + JSON.stringify(this.resultList));
      this.resultList = this.resultList.filter((item) => {
        return ((item.partno.toLowerCase().indexOf(filterValue.toLowerCase()) > -1)
          || (item.Description.toLowerCase().indexOf(filterValue.toLowerCase()) > -1));
      });
    }
    //  console.log('.........' + JSON.stringify(this.resultList));
    this._cdr.markForCheck();
  }



  openDialog(searchstring): void {

    if (searchstring.length > 2) {
      this.commonApiService.getProductInfo(searchstring).subscribe(
        data => {
          this.resultList = data;
          //    console.log('ABCD >> ' + JSON.stringify(this.resultList));
          if (this.resultList.length === 0) {

            this.member404 = 'No Matching Records';
            this._cdr.markForCheck();

          } else if (this.resultList.length > 0) {
            this.member404 = '';
            this._cdr.markForCheck();
          }

        }
      );

    }
  }


  reset() {
    this.searchbar.value = '';
    this.member404 = '';
    this.resultList = null;
  }

  // async addToCart(item) {

  //   const modal = await this.modalController.create({
  //     component: AddToCartComponent,
  //     componentProps: {
  //       data: item
  //     },
  //     cssClass:'my-custom-class'
  //   });

  //   modal.onDidDismiss().then((result) => {
  //     this.cdr.markForCheck();
  //   });


  //   modal.present();
  // }


  addPartsToCart(item) {

    console.log('object............' + JSON.stringify(this._cartservice.getParts()));

    console.log('object............' + item.partno);

    console.log('object............' + this._cartservice.getParts().indexOf(item.partno));



    if (JSON.stringify(this._cartservice.getParts()).indexOf(item.partno) === -1) {
      this._cartservice.addParts(item.id, item.partno, item.description, item.mrp, item.quantity);
    }

    this._cdr.markForCheck();
  }

  goToCart() {
    this._router.navigateByUrl(`/cart`);
  }

}
