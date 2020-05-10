import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { ModalController, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-show-customers',
  templateUrl: './show-customers.component.html',
  styleUrls: ['./show-customers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowCustomersComponent implements OnInit {
  customerdata: any;
  resultList: any;
  noMatch: any;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;


  constructor(private _commonApiService: CommonApiService,
    private _modalcontroller: ModalController,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit() {

    // this._commonApiService.getAllActiveCustomers(1).subscribe(data => {
    //   this.customerdata = data;

    //   this._cdr.markForCheck();
    // });
  }


  async addCustomer(item) {
    await this._modalcontroller.dismiss(item);
  }

  closeModal() {
    this._modalcontroller.dismiss();
  }

  ionViewDidEnter() {
    this.searchbar.setFocus();
  }


  openDialog(searchstring): void {



    if (searchstring.length > 2) {


      this._commonApiService.getCustomerInfo('1', searchstring).subscribe(
        data => {
          this.resultList = data;

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




}
