import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit {
  resultList: any;
  noMatch: any;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  constructor(private _commonApiService: CommonApiService, private _modalcontroller: ModalController,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() { }



  ionViewDidEnter() {
    this.searchbar.setFocus();
  }


  openDialog(searchstring): void {


    if (searchstring.length > 2) {

      this._commonApiService.getProductInfo(searchstring).subscribe(
        data => {
          this.resultList = data;
          // console.log('ABCD >> ' + JSON.stringify(this.resultList));
          if (this.resultList.length === 0) {

            this.noMatch = 'No Matching Records';
            this._cdr.markForCheck();

          } else if (this.resultList.length > 0) {
            this.noMatch = '';
            this._cdr.markForCheck();
          }

        }
      );

    }
  }

  reset() {
    this.searchbar.value = '';
    this.noMatch = '';
    this.resultList = null;
  }

  async addProduct(item) {
    await this._modalcontroller.dismiss(item);
  }

  closeModal() {
    this._modalcontroller.dismiss();
  }



}
