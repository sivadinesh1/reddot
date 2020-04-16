import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhoneValidator } from 'src/app/util/validators/phone.validator';

@Component({
  selector: 'app-change-mrp',
  templateUrl: './change-mrp.component.html',
  styleUrls: ['./change-mrp.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeMrpComponent implements OnInit {

  resultList: any;
  noMatch: any;


  center_id;
  pArry;
  rArry;

  msg: any;

  current_mrp: any;

  submitForm: FormGroup;

  constructor(private _commonApiService: CommonApiService, private _modalcontroller: ModalController,
    private _cdr: ChangeDetectorRef,
  ) {



    this.submitForm = new FormGroup({
      'mrp': new FormControl('', Validators.compose([Validators.required])),
    });


  }

  ngOnInit() { }



  ionViewDidEnter() {
    let list = this.pArry;
    let removeList = this.rArry;



    this.rArry.forEach((e) => {

      this.current_mrp = this.pArry[e].mrp;
    });

    console.log('object A >> ' + JSON.stringify(this.pArry));
    console.log('object X >> ' + JSON.stringify(this.rArry));

  }

  async newMRP() {

    if (this.current_mrp === this.submitForm.value.mrp) {
      this.msg = "No Change in MRP";
    } else {
      await this._modalcontroller.dismiss(this.submitForm.value.mrp);
    }


  }


  closeModal() {
    this._modalcontroller.dismiss();
  }


}
