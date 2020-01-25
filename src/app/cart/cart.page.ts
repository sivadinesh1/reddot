

import { CartService } from './../services/cart.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: [
    './cart.page.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartPage implements OnInit {
  resultList: any;
  origResultList: any;
  submitForm: FormGroup;
  total: any;

  constructor(private _cartservice: CartService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) { }

  ionViewDidEnter() {
    this.resultList = this._cartservice.getParts();
    this.origResultList = this.resultList;
    console.log('object,,,,,,,,,,,,' + JSON.stringify(this.resultList));
    this.calculateTotal();
    this._cdr.markForCheck();
  }

  ngOnInit() {




    this._cdr.markForCheck();
  }

  calculateTotal() {

    var initialValue = 0;

    //   var sum = [{x: 1}, {x: 2}, {x: 3}].reduce(function (accumulator, currentValue) {
    //     return accumulator + currentValue.x;
    // },initialValue)


    const reducer = (accumulator, currentValue) => accumulator + (currentValue.quantity * currentValue.mrp);

    this.total = this.resultList.reduce(reducer, initialValue);

    console.log('object ... ' + this.total);

    this._cdr.markForCheck();

  }


  remove(index) {
    this.resultList.splice(index, 1);
    this.origResultList = this.resultList;
    this.calculateTotal();
  }


  increase(item) {
    let temppartno = item.partno;
    let tempqty = item.quantity;

    let newqty = tempqty + 1;

    let itemIndex = this.origResultList.findIndex(e => e.partno === item.partno);

    console.log('..............ITEM QTY BEFORE >>>> ........... ' + item.quantity);
    item.quantity = newqty;
    console.log('.............ITEM QTY AFTER >>>>> ............ ' + item.quantity);

    this.resultList[itemIndex] = item;
    this.calculateTotal();
    this._cdr.markForCheck();

  }

  decrease(index) {
    const tempItem = this.origResultList[index];

    if (tempItem.quantity > 1) {
      tempItem.quantity = tempItem.quantity - 1;
      this.resultList[index] = tempItem;
      this.calculateTotal();
      this._cdr.markForCheck();
    }

  }

}
