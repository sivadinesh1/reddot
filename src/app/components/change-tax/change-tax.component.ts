
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';

@Component({
  selector: 'app-change-tax',
  templateUrl: './change-tax.component.html',
  styleUrls: ['./change-tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeTaxComponent implements OnInit {

  resultList: any;
  noMatch: any;


  center_id;
  pArry;
  rArry;

  product_id: any;

  submitForm: FormGroup;

  constructor(private _commonApiService: CommonApiService, private _modalcontroller: ModalController,
    private _cdr: ChangeDetectorRef,
  ) {



    this.submitForm = new FormGroup({
      'tax': new FormControl('', Validators.compose([Validators.required])),
    });


  }

  ngOnInit() { }



  ionViewDidEnter() {
    let list = this.pArry;
    let removeList = this.rArry;



    this.rArry.forEach((e) => {

      this.product_id = this.pArry[e].product_id;
    });

    console.log('object A >> ' + JSON.stringify(this.pArry));
    console.log('object X >> ' + JSON.stringify(this.rArry));

  }

  async applyOnce() {
    await this._modalcontroller.dismiss(this.submitForm.value.tax);
  }

  async permanentTaxChange() {

    this._commonApiService.updateTax({ productid: this.product_id, taxrate: this.submitForm.value.tax }).subscribe(
      data => {
        this.resultList = data;
      }
    );



    await this._modalcontroller.dismiss(this.submitForm.value.tax);
  }


  closeModal() {
    this._modalcontroller.dismiss();
  }


}
