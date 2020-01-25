import { Injectable } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Parts } from '../models/parts.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _parts: Parts[] = [];
  ;
  constructor(private storage: Storage, private plt: Platform,

    private toastController: ToastController,
    private _httpclient: HttpClient) {

    this.plt.ready().then(() => {
      console.log('when calling 1');
    });
  }

  getItems(key): Promise<string> {
    return this.storage.get(key);
  }


  async addToCart() {
    await this.storage.set('itemid', '');
  }


  getParts() {
    return [...this._parts];
  }

  addParts(id: string, partno: string, description: string, mrp: number, quantity: number) {
    const newPart = new Parts(id, partno, description, mrp, quantity);
    this._parts.push(newPart);
  }

}
