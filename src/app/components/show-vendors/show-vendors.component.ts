import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-vendors',
  templateUrl: './show-vendors.component.html',
  styleUrls: ['./show-vendors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowVendorsComponent implements OnInit {
  vendordata: any;

  constructor(private _commonApiService: CommonApiService,
    private _modalcontroller: ModalController,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this._commonApiService.getAllActiveVendors(1).subscribe(data => {
      this.vendordata = data;

      this._cdr.markForCheck();
    });
  }


  async addVendor(item) {
    await this._modalcontroller.dismiss(item);
  }

  closeModal() {
    this._modalcontroller.dismiss();
  }


}
