import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonApiService } from '../../services/common-api.service';
import { AuthenticationService } from '../../services/authentication.service';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { purchase } from '../../models/purchase';
import { Vendor } from 'src/app/models/Vendor';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-search-purchase',
  templateUrl: './search-purchase.page.html',
  styleUrls: ['./search-purchase.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPurchasePage implements OnInit {

  purchases$: Observable<purchase[]>;
  vendor$: Observable<Vendor[]>;

  resultList: any;
  vendorList: any;
  center_id: any;

  statusFlag = 'D';
  selectedVend = 'all';

  today = new Date();
  submitForm: FormGroup;
  maxDate = new Date();
  minDate = new Date();
  dobMaxDate = new Date();
  statusList = [{ "id": "D", "value": "Draft" }, { "id": "C", "value": "Completed" }]

  fromdate = new Date();
  todate = new Date();


  constructor(private _cdr: ChangeDetectorRef, private _commonApiService: CommonApiService,
    private _fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,
    public alertController: AlertController,
    private _authservice: AuthenticationService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

    const dateOffset = (24 * 60 * 60 * 1000) * 3;
    this.fromdate.setTime(this.minDate.getTime() - dateOffset);


    this._route.params.subscribe(params => {
      this.init();
    });

  }

  ngOnInit() {


  }

  init() {
    this.vendor$ = this._commonApiService.getAllActiveVendors(this.center_id);

    this.submitForm = this._fb.group({
      vendorid: new FormControl('all'),
      todate: [this.todate, Validators.required],
      fromdate: [this.fromdate, Validators.required],
      status: new FormControl('D'),
    })

    this.search();
    this._cdr.markForCheck();

  }


  search() {
    this.purchases$ = this._commonApiService
      .searchPurchases(this.center_id, this.submitForm.value.vendorid,
        this.submitForm.value.status,
        this.submitForm.value.fromdate,
        this.submitForm.value.todate,

      );
    this._cdr.markForCheck();
  }

  goPurchaseEditScreen(item) {
    this._router.navigateByUrl(`/home/purchase/${item.id}`);
  }

  goPurchaseAddScreen() {
    this._router.navigateByUrl(`/home/purchase/0`);
  }

  statusChange($event) {
    this.statusChange = $event.source.value;
  }

  selectedVendor($event) {
    this.selectedVend = $event.source.value;
  }

  toDateSelected($event) {
    this.todate = $event.target.value;
  }

  fromDateSelected($event) {
    this.fromdate = $event.target.value;
  }

  delete(item) {
    this._commonApiService.deletePurchaseData(item.id).subscribe((data: any) => {
      this.init();

    })
  }


  async presentAlertConfirm(item) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure to Delete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.delete(item);
          }
        }
      ]
    });

    await alert.present();
  }

}
