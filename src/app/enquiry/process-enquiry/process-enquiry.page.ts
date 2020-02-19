import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CurrencyPadComponent } from 'src/app/components/currency-pad/currency-pad.component';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { AddProductComponent } from 'src/app/components/add-product/add-product.component';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-process-enquiry',
  templateUrl: './process-enquiry.page.html',
  styleUrls: ['./process-enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessEnquiryPage implements OnInit {

  enqDetailsOrig: any;
  // enqDetailsPrep: any;
  selectedEnq: any;

  productArr = [];

  enqid: any;
  center_id: any;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private dialog: MatDialog, private _modalcontroller: ModalController,
    private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService,
    private _cdr: ChangeDetectorRef) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

  }

  ngOnInit() {
    this.enqid = this._route.snapshot.params['enqid'];
    this._commonApiService.getEnquiryDetails(this.enqid).subscribe((data: any) => {
      this.enqDetailsOrig = data;


      this.enqDetailsOrig.forEach(element => {
        this.productArr.push({
          "id": element.id, "enquiry_id": element.enquiry_id, "notes": element.notes,
          "askqty": element.askqty, "giveqty": element.askqty,
          "status": element.status, "invoiceno": element.invoiceno, "center_id": this.center_id,
          "product_id": '',
          "product_code": '',
          "product_desc": '',
          "qty": '',
          "packetsize": '',
          "unit_price": '',
          "mrp": '',
        });
      });


      this._cdr.markForCheck();
    });
  }


  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0) {

          this.productArr[idx].giveqty = +data;


        }

        this._cdr.markForCheck();
      }
    );
  }

  async showAddProductComp(idx) {


    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: { center_id: this.center_id, customer_id: 0, },
      cssClass: 'select-modal'

    });

    modal.onDidDismiss().then((result) => {
      console.log('The result:', result);

      if (result.data !== undefined) {
        let temp = result.data;

        this.productArr[idx].product_id = temp.id;
        this.productArr[idx].product_code = temp.product_code;
        this.productArr[idx].product_desc = temp.description;
        this.productArr[idx].qty = temp.packetsize;
        this.productArr[idx].packetsize = temp.packetsize;
        this.productArr[idx].unit_price = temp.unit_price;
        this.productArr[idx].mrp = temp.mrp;
        this.productArr[idx].status = 'P';
        this.productArr[idx].stockid = temp.stock_pk;
        this.productArr[idx].available_stock = temp.available_stock;
      }

      this._cdr.markForCheck();
    });

    await modal.present();

  }







  onClick(selItem) {
    this.selectedEnq = selItem.id;
  }

  isSelected(item) {

    if (item.id === this.selectedEnq) {
      return 'grey';
    }
  }

  // getStrikeThroughClass(idx) {
  //   let className = '';

  //   if (this.productArr[idx].status === 'P') {
  //     className = 'line-through';
  //   }
  //   if (this.productArr[idx].status === 'B') {
  //     className = 'back-order';
  //   }
  //   return className;
  // }



  moveToSale() {

    console.log('object.......' + this.productArr);

    this._commonApiService.moveToSale(this.productArr).subscribe((data: any) => {
      console.log('object.. ' + JSON.stringify(data));

      if (data.body.result === 'success') {


        console.log('object...SUCCESS..')
        this._router.navigate([`/home/enquiry/open-enquiry`]);

      } else {

      }

      this._cdr.markForCheck();
    });


  }

  openEnquiry() {
    this._router.navigateByUrl(`/home/enquiry/open-enquiry`);
  }


  goEnquiryScreen() {
    this._router.navigateByUrl(`/enquiry`);
  }

}



