import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ModalController, PickerController, AlertController } from '@ionic/angular';
import { AddProductComponent } from '../components/add-product/add-product.component';
import { CommonApiService } from '../services/common-api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PickerOptions } from '@ionic/core';
import { MatDialog } from '@angular/material';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';
import { ShowVendorsComponent } from '../components/show-vendors/show-vendors.component';
import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  customername: string = '';

  listArr = [];

  total = "0.00";

  test1: any;
  customer_state_code: any;
  center_state_code: any
  i_gst: any;
  customerdata: any;
  submitForm: FormGroup;

  customerselected: any;

  no_of_boxes: any;

  selNoOfBoxes: any;
  igst: any;
  cgst: any;
  sgst: any;

  igstTotal = "0.00";
  cgstTotal = "0.00";
  sgstTotal = "0.00";

  tax_percentage: any;
  taxable_value: any;

  @ViewChild('invno', { static: false }) inputEl: ElementRef;

  constructor(private _modalcontroller: ModalController, private _pickerctrl: PickerController,
    public dialog: MatDialog, public alertController: AlertController,
    private _commonApiService: CommonApiService, private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {


    this.center_state_code = '33';


  }

  ngOnInit() {

    this.submitForm = this._fb.group({
      customer: new FormControl(null, Validators.required),
      invoiceno: new FormControl(null, Validators.required),
      invoicedate: new FormControl(''),
      orderno: new FormControl(''),
      orderdate: new FormControl(''),
      lrno: new FormControl(''),
      lrdate: new FormControl(''),
      noofboxes: new FormControl(0),
      orderrcvddt: new FormControl(''),
      noofitems: new FormControl(0),
      totalqty: new FormControl(0),
      value: new FormControl(0),
      totalvalue: new FormControl(0),
      igst: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),
      transport_charges: new FormControl(0),
      unloading_charges: new FormControl(0),
      misc_charges: new FormControl(0),
      net_total: new FormControl(0),
      taxable_value: new FormControl(0),

      productarr: new FormControl(null, Validators.required)

    });

    this.customerselected = false;

  }


  async showAllCustomersComp() {

    const modal = await this._modalcontroller.create({
      component: ShowCustomersComponent,
      componentProps: {},
      cssClass: 'customer-comp-styl'

    });


    modal.onDidDismiss().then((result) => {
      let custData = result.data;

      this.customer_state_code = custData.code;

      this.submitForm.patchValue({
        customer: custData,
      });

      this.customername = custData.name;
      this.customerselected = true;
      this.setTaxLabel();
      this.setTaxSegment(custData.taxrate);

      this._cdr.markForCheck();

    })

    await modal.present();
  }

  async showAddProductComp() {

    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: {},
      cssClass: 'select-modal'

    });

    modal.onDidDismiss().then((result) => {
      console.log('The result:', result);
      let temp = result.data;

      console.log('MMM' + this.listArr);

      // let taxrate = temp.taxrate;

      this.setTaxSegment(temp.taxrate);

      // from product tbl
      this.listArr.push(
        {
          "product_id": temp.id,
          "product_code": temp.product_code,
          "product_desc": temp.description,
          "qty": temp.packetsize,
          "packetsize": temp.packetsize,
          "unit_price": temp.unit_price,
          "mrp": temp.mrp,
          "mrp_change_flag": 'N',
          "taxrate": temp.taxrate,

          // "tax_amt": ((temp.unit_price) * ((temp.taxrate) / 100)).toFixed(2),

          "tax_value": ((temp.unit_price * temp.packetsize) * ((temp.taxrate) / 100)).toFixed(2),

          "taxable_value": (temp.unit_price * temp.packetsize),
          "total_value": ((temp.unit_price * temp.packetsize) + (temp.unit_price * (temp.packetsize) * temp.taxrate) / 100).toFixed(2),
          "igst": this.igst,
          "cgst": this.cgst,
          "sgst": this.sgst
        });



      const tempArr = this.listArr.map(arrItem => {
        return parseFloat(arrItem.total_value)
      }
      );

      const tempArrCostPrice = this.listArr.map(arr => {
        return parseFloat(arr.unit_price)
      })

      const xIgst = this.listArr.map(item => {
        console.log('xIgst....' + item.unit_price * parseFloat(this.igst) / 100);

        return item.unit_price * item.qty * parseFloat(this.igst) / 100;
      })

      const xCgst = this.listArr.map(item => {

        return item.unit_price * item.qty * (parseFloat(this.cgst) / 100);
      })

      const xSgst = this.listArr.map(item => {

        return item.unit_price * item.qty * parseFloat(this.sgst) / 100;
      })


      this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
      console.log("TCL: PurchasePage -> showAddProductComp -> this.total", this.total)


      this.taxable_value = tempArrCostPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

      this.submitForm.patchValue({
        taxable_value: this.taxable_value,
      });



      if (this.i_gst) {
        this.igstTotal = xIgst.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

        this.submitForm.patchValue({
          igst: this.igstTotal,
        });

        this.submitForm.patchValue({
          cgst: 0,
        });
        this.submitForm.patchValue({
          sgst: 0,
        });

      } else {
        this.cgstTotal = xCgst.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
        this.sgstTotal = xSgst.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
        this.submitForm.patchValue({
          cgst: this.cgstTotal,
        });
        this.submitForm.patchValue({
          sgst: this.sgstTotal,
        });
        this.submitForm.patchValue({
          igst: 0,
        });
      }




      this._cdr.markForCheck();
    });

    await modal.present();

  }

  deleteProduct(item, idx) {
    if (idx > -1) {
      this.listArr.splice(idx, 1);

      this.calc();

      this._cdr.markForCheck();
    }
  }


  setTaxSegment(taxrate: number) {
    if (this.customer_state_code !== this.center_state_code) {
      this.i_gst = true;
      this.igst = taxrate;
      this.cgst = 0;
      this.sgst = 0;
    } else {
      this.i_gst = false;
      this.igst = 0;
      this.cgst = taxrate / 2;
      this.sgst = taxrate / 2;
    }
  }

  setTaxLabel() {
    if (this.customer_state_code !== this.center_state_code) {
      this.i_gst = true;

    } else {
      this.i_gst = false;


    }

  }

  onSubmit() {

    if (this.listArr.length == 0) {
      this.presentAlert('No products added to save!');
    }

    if (this.listArr.length > 0) {
      if (this.submitForm.value.invoiceno == null) {
        this.presentAlert('Invoice number is empty!');
        this.inputEl.nativeElement.focus();
      } else {
        this.presentAlertConfirm();

        this.submitForm.patchValue({
          productarr: this.listArr,
        });

        this.submitForm.patchValue({
          noofitems: this.listArr.length,
        });

        const tot_qty_check_Arr = this.listArr.map(arrItem => {
          return parseFloat(arrItem.qty)
        }
        );

        let tmpTotQty = tot_qty_check_Arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

        this.submitForm.patchValue({
          totalqty: tmpTotQty,
        });

        this.submitForm.patchValue({
          totalvalue: this.total
        })

        let tmpNetTot = parseFloat(this.total) + parseFloat(this.submitForm.value.transport_charges) +
          parseFloat(this.submitForm.value.unloading_charges) +
          parseFloat(this.submitForm.value.misc_charges);



        this.submitForm.patchValue({
          net_total: tmpNetTot
        })



      }



    }


  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',

      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  selectVendor() {

    let vendorvalue = this.submitForm.value.vendor;
    console.log('print list ' + JSON.stringify(vendorvalue));
    this.customer_state_code = vendorvalue.code;
    this.customerselected = true;
    this.setTaxLabel();

    this._cdr.markForCheck();
  }





  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {

          this.listArr[idx].qty = data;

          this.qtyChange(idx);
        }

        this._cdr.markForCheck();
      }
    );
  }

  openMrpCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if ((data != undefined) && (data.length > 0) && (data != 0) && this.listArr[idx].mrp !== data) {

          this.listArr[idx].mrp = data;
          this.listArr[idx].mrp_change_flag = 'Y'

        }

        this._cdr.markForCheck();
      }
    );
  }


  openNumberPad(field) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {

          this.submitForm.controls[field].setValue(data);

        }


        this._cdr.markForCheck();
      }
    );
  }


  qtyChange(idx) {

    this.listArr[idx].total_value = ((this.listArr[idx].unit_price * this.listArr[idx].qty) + (this.listArr[idx].unit_price * (this.listArr[idx].qty) * this.listArr[idx].taxrate) / 100).toFixed(2)
    this.listArr[idx].taxable_value = ((this.listArr[idx].qty) * (this.listArr[idx].unit_price)).toFixed(2);
    this.listArr[idx].tax_value = ((this.listArr[idx].taxable_value) * ((this.listArr[idx].taxrate) / 100)).toFixed(2);

    this.calc();

    this._cdr.markForCheck();
  }

  calc() {

    const tempArr = this.listArr.map(arrItem => {
      return parseFloat(arrItem.taxable_value) + parseFloat(arrItem.tax_value);
    }
    );

    this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
    console.log("TCL: PurchasePage -> calc -> this.total", this.total)

    const tempArrCostPrice = this.listArr.map(arr => {
      return parseFloat(arr.unit_price)
    })

    const xIgst = this.listArr.map(item => {
      console.log('igst....' + item.unit_price);

      return item.unit_price * item.qty * parseFloat(this.igst) / 100;
    })

    const xCgst = this.listArr.map(item => {

      return item.unit_price * item.qty * (parseFloat(this.cgst) / 100);
    })

    const xSgst = this.listArr.map(item => {
      console.log('igst....' + item.unit_price);

      return item.unit_price * item.qty * parseFloat(this.sgst) / 100;
    })


    this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

    this.taxable_value = tempArrCostPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

    this.submitForm.patchValue({
      taxable_value: this.taxable_value,
    });


    if (this.i_gst) {
      this.igstTotal = xIgst.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

      this.submitForm.patchValue({
        igst: this.igstTotal,
      });

      this.submitForm.patchValue({
        cgst: 0,
      });
      this.submitForm.patchValue({
        sgst: 0,
      });

    } else {
      this.cgstTotal = xCgst.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
      this.sgstTotal = xSgst.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
      this.submitForm.patchValue({
        cgst: this.cgstTotal,
      });
      this.submitForm.patchValue({
        sgst: this.sgstTotal,
      });
      this.submitForm.patchValue({
        igst: 0,
      });
    }

  }

  clearAll() {
    this.listArr = [];
    this.total = "0.00";

    this.igstTotal = "0.00";
    this.cgstTotal = "0.00";
    this.sgstTotal = "0.00";
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do You want to save!!!',
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
            this._commonApiService.saveSaleOrder(this.submitForm.value).subscribe((data: any) => {
              console.log('object.. ' + JSON.stringify(data));

              this._cdr.markForCheck();
            });
          }
        }
      ]
    });

    await alert.present();
  }

}
