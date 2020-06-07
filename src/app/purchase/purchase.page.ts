import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ModalController, PickerController, AlertController } from '@ionic/angular';
import { AddProductComponent } from '../components/add-product/add-product.component';
import { CommonApiService } from '../services/common-api.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PickerOptions } from '@ionic/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';
import { ShowVendorsComponent } from '../components/show-vendors/show-vendors.component';
import { AuthenticationService } from '../services/authentication.service';
import { ChangeTaxComponent } from '../components/change-tax/change-tax.component';
import { ChangeMrpComponent } from '../components/change-mrp/change-mrp.component';
import { Route, ActivatedRoute } from '@angular/router';
import { NullToQuotePipe } from '../util/pipes/null-quote.pipe';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PurchasePage implements OnInit {

  vendorname: string = '';
  vendorstate = '';

  listArr = [];

  total = "0.00";

  test1: any;
  vendor_state_code: any;
  center_state_code: any
  i_gst: any;
  vendordata: any;
  submitForm: FormGroup;

  vendorselected: any;

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
  center_id: any;

  removeRowArr = [];
  deletedRowArr = [];

  showDelIcon = false;
  singleRowSelected = false;
  purchaseid: any;
  rawPurchaseData: any;

  maxDate = new Date();
  maxOrderDate = new Date();

  editCompletedPurchase: any;

  @ViewChild('invno', { static: false }) inputEl: ElementRef;
  @ViewChild('orderno', { static: false }) orderNoEl: ElementRef;
  @ViewChildren('myCheckbox') private myCheckboxes: QueryList<any>;

  constructor(private _modalcontroller: ModalController, private _pickerctrl: PickerController,
    public dialog: MatDialog, public alertController: AlertController,
    private _route: ActivatedRoute,
    private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService, private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {

    this._route.data.subscribe(data => {
      this.rawPurchaseData = data['rawpurchasedata'];
      const currentUser = this._authservice.currentUserValue;
      this.center_state_code = currentUser.code;
      this.center_id = currentUser.center_id;
      this.initialize();
    });


  }

  ngOnInit() {
  }
  initialize() {

    this.init();

    this.vendorselected = false;

    if (this.rawPurchaseData[0] !== undefined && this.rawPurchaseData[0].id !== 0) {

      this.submitForm.patchValue({
        purchaseid: this.rawPurchaseData[0].id,
        invoiceno: this.rawPurchaseData[0].invoice_no,
        invoicedate: new Date(new NullToQuotePipe().transform(this.rawPurchaseData[0].invoice_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),

        orderdate: this.rawPurchaseData[0].order_date === '' ? '' : new Date(new NullToQuotePipe().transform(this.rawPurchaseData[0].order_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),

        lrno: this.rawPurchaseData[0].lr_no,

        lrdate: this.rawPurchaseData[0].lr_date === '' ? '' : new Date(new NullToQuotePipe().transform(this.rawPurchaseData[0].lr_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),
        orderno: this.rawPurchaseData[0].order_no,
        noofboxes: this.rawPurchaseData[0].no_of_boxes,

        orderrcvddt: this.rawPurchaseData[0].received_date === '' ? '' : new Date(new NullToQuotePipe().transform(this.rawPurchaseData[0].received_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),


        noofitems: this.rawPurchaseData[0].no_of_items,
        totalqty: this.rawPurchaseData[0].total_qty,
        value: this.rawPurchaseData[0].total_value,
        totalvalue: this.rawPurchaseData[0].total_value,
        igst: this.rawPurchaseData[0].igst,
        cgst: this.rawPurchaseData[0].cgst,
        sgst: this.rawPurchaseData[0].sgst,
        transport_charges: this.rawPurchaseData[0].transport_charges,
        unloading_charges: this.rawPurchaseData[0].unloading_charges,
        misc_charges: this.rawPurchaseData[0].misc_charges,
        net_total: this.rawPurchaseData[0].net_total,
        taxable_value: this.rawPurchaseData[0].taxable_value,
        status: this.rawPurchaseData[0].status

      });

      if (this.rawPurchaseData[0].status === 'C') {
        this.editCompletedPurchase = true;
      }

      this._cdr.markForCheck();


      this._commonApiService.getVendorDetails(this.center_id, this.rawPurchaseData[0].vendor_id).subscribe((vendData: any) => {

        this.vendor_state_code = vendData[0].code;

        this.submitForm.patchValue({
          vendor: vendData[0],
        });

        this.vendorname = vendData[0].name;
        this.vendorstate = vendData[0].state;
        this.vendorselected = true;
        this.setTaxLabel();
        this.setTaxSegment(vendData[0].taxrate);

        this._cdr.markForCheck();
      });


      this._commonApiService.purchaseDetails(this.rawPurchaseData[0].id).subscribe((purchaseData: any) => {
        let pData = purchaseData;

        pData.forEach(element => {
          this.processItems(element);
        });
      });


      this._cdr.markForCheck();

    }
  }

  init() {
    this.submitForm = this._fb.group({
      centerid: new FormControl(this.center_id),
      purchaseid: new FormControl('', Validators.required),
      vendor: new FormControl(null, Validators.required),
      invoiceno: new FormControl(null, Validators.required),
      invoicedate: new FormControl(null, Validators.required),
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
      status: new FormControl('D'),

      productarr: new FormControl(null, Validators.required)

    });
  }





  async showAllVendorsComp() {

    const modal = await this._modalcontroller.create({
      component: ShowVendorsComponent,
      componentProps: {},
      cssClass: 'vendor-comp-styl'

    });


    modal.onDidDismiss().then((result) => {
      let vendData = result.data;

      this.vendor_state_code = vendData.code;

      this.submitForm.patchValue({
        vendor: vendData,
      });

      this.vendorname = vendData.name;
      this.vendorstate = vendData.state;

      this.vendorselected = true;
      this.setTaxLabel();
      this.setTaxSegment(vendData.taxrate);

      this._cdr.markForCheck();

    })

    await modal.present();
  }

  async showAddProductComp() {

    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: { center_id: this.center_id, customer_id: 0 },
      cssClass: 'select-modal'

    });

    modal.onDidDismiss().then((result) => {
      console.log('The result:', result);
      let temp = result.data;

      this.processItems(temp);

    });

    await modal.present();

  }


  processItems(temp) {

    this.setTaxSegment(temp.taxrate);


    let pid = '';
    if (this.rawPurchaseData[0] !== undefined) {
      pid = new NullToQuotePipe().transform(this.rawPurchaseData[0].id);
    }

    let oldval = 0;

    if (new NullToQuotePipe().transform(temp.id) !== '' && this.editCompletedPurchase) {
      oldval = temp.qty;
    }


    // from product tbl
    this.listArr.push(
      {
        "purchase_id": pid,
        "pur_det_id": new NullToQuotePipe().transform(temp.id),
        "checkbox": false,
        "product_id": temp.product_id,
        "product_code": temp.product_code,
        "product_desc": temp.description,
        "qty": temp.qty,
        "packetsize": temp.packetsize,
        "unit_price": temp.unit_price,
        "mrp": temp.mrp,
        "mrp_change_flag": 'N',
        "taxrate": temp.taxrate,

        "tax_value": ((temp.unit_price * temp.qty) * ((temp.taxrate) / 100)).toFixed(2),

        "taxable_value": (temp.unit_price * temp.qty),
        "total_value": ((temp.unit_price * temp.qty) + (temp.unit_price * (temp.qty) * temp.taxrate) / 100).toFixed(2),



        "igst": this.igst,
        "cgst": this.cgst,
        "sgst": this.sgst,
        "old_val": oldval
      });

    const tempArr = this.listArr.map(arrItem => {
      return parseFloat(arrItem.total_value)
    }
    );

    const tempArrCostPrice = this.listArr.map(arr => {
      return parseFloat(arr.unit_price)
    })


    this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
    console.log("TCL: PurchasePage -> showAddProductComp -> this.total", this.total)


    this.taxable_value = tempArrCostPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

    this.submitForm.patchValue({
      taxable_value: this.taxable_value,
    });


    this.sumTotalTax();

    this._cdr.markForCheck();

  }


  sumTotalTax() {


    if (this.i_gst) {


      this.igstTotal = this.listArr.map(item => {
        console.log('igst....' + item.unit_price);

        return item.unit_price * item.qty * parseFloat(item.taxrate) / 100;
      })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

      this.submitForm.patchValue({
        igst: this.igstTotal,
        cgst: 0,
        sgst: 0,
      });


    } else {

      this.cgstTotal = this.listArr.map(item => {

        return item.unit_price * item.qty * (parseFloat(this.cgst) / 100);
      })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

      this.sgstTotal = this.listArr.map(item => {

        return item.unit_price * item.qty * parseFloat(this.sgst) / 100;
      })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);


      this.submitForm.patchValue({
        cgst: this.cgstTotal,
        sgst: this.sgstTotal,
        igst: 0,
      });

    }

  }



  deleteProduct(idx) {
    let test = this.listArr[idx];


    if (this.listArr[idx].pur_det_id != '') {

      this.deletedRowArr.push(this.listArr[idx]);
    }

    this.listArr.splice(idx, 1);
    this.removeRowArr = this.removeRowArr.filter(e => e !== idx);

    this.delIconStatus();
    this.checkIsSingleRow();
    this.calc();


    // this._commonApiService.deletePurchaseDetails({ id: this.listArr[idx].pur_det_id, purchaseid: this.listArr[idx].purchase_id }).subscribe((data: any) => {


    //   if (data.body.result === 'success') {
    //     this.listArr.splice(idx, 1);
    //     this.removeRowArr = this.removeRowArr.filter(e => e !== idx);

    //     this.delIconStatus();
    //     this.checkIsSingleRow();
    //     this.calc();



    //   } else {
    //     this.presentAlert('Error: Something went wrong Contact Admin!');
    //   }

    //   this._cdr.markForCheck();
    // });






    this._cdr.markForCheck();
  }


  checkIsSingleRow() {
    if (this.removeRowArr.length === 1) {
      this.singleRowSelected = true;
    } else {
      this.singleRowSelected = false;
    }
  }

  setTaxSegment(taxrate: number) {

    if (this.vendor_state_code !== this.center_state_code) {
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
    if (this.vendor_state_code !== this.center_state_code) {
      this.i_gst = true;

    } else {
      this.i_gst = false;


    }

  }

  // draft - status
  onSave(action) {
    this.onSubmit(action);
  }

  // final c completed - status
  onSavenSubmit(action) {
    this.onSubmit(action);
  }


  validateForms() {

    if (this.submitForm.value.invoiceno == null) {
      this.inputEl.nativeElement.focus();
      this.presentAlert('Enter Invoice number!');
      return false;
    }


    if (this.submitForm.value.invoicedate == null) {
      this.presentAlert('Enter Invoice Date!');
      return false;
    }

    if (this.submitForm.value.invoicedate !== null && this.submitForm.value.orderdate !== "") {
      if (this.submitForm.value.orderno === "") {
        this.orderNoEl.nativeElement.focus();
        this.presentAlert('Order Date without Order # not allowed');
        return false;
      }

      if (this.submitForm.value.orderdate > this.submitForm.value.invoicedate) {
        this.presentAlert('Order date should be less than Invoice date');
        return false;
      }

    }

    if (this.submitForm.value.invoicedate !== null && this.submitForm.value.lrdate !== "") {
      if (this.submitForm.value.lrno === "") {
        this.presentAlert('Lr Date without Lr # not allowed');
        return false;
      }
      if (this.submitForm.value.lrdate < this.submitForm.value.invoicedate) {
        this.presentAlert('Lr date should be after Invoice date');
        return false;
      }


    }

    return true;

  }

  onSubmit(action) {



    if (this.listArr.length == 0) {
      return this.presentAlert('No products added to save!');

    }

    if (this.listArr.length > 0) {


      if (this.validateForms()) {

        if (action === 'add') {
          this.presentAlertConfirm('add');
        } else {
          this.presentAlertConfirm('draft');
        }

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
    this.vendor_state_code = vendorvalue.code;
    this.vendorselected = true;
    this.setTaxLabel();

    this._cdr.markForCheck();
  }





  openCurrencyPad(idx) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";


    const dialogRef = this.dialog.open(CurrencyPadComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(val => {
          this.listArr[idx].qty = val;
          this.qtyChange(idx);
        })
      ).subscribe();


  }


  openNumberPad(field) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });


    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap((val) => {
          this.submitForm.controls[field].setValue(val);
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


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



    // this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
    // console.log("TCL: PurchasePage -> calc -> this.total", this.total)

    const tempArrCostPrice = this.listArr.map(arr => {
      return parseFloat(arr.unit_price) * parseFloat(arr.qty);
    })

    this.total = "" + tempArr;

    // this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

    this.taxable_value = tempArrCostPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

    this.submitForm.patchValue({
      taxable_value: this.taxable_value,
    });

    this.submitForm.patchValue({
      totalvalue: this.total
    })


    this.sumTotalTax();
    this._cdr.markForCheck();

  }

  clearAll() {
    this.listArr = [];
    this.total = "0.00";

    this.igstTotal = "0.00";
    this.cgstTotal = "0.00";
    this.sgstTotal = "0.00";
  }

  async presentAlertConfirm(action) {
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

            this.executeDeletes();

            if (action === 'add') {
              this.submitForm.patchValue({
                status: 'C',
              });
            } else if (action === 'draft') {
              this.submitForm.patchValue({
                status: 'D',
              });
            }
            this._commonApiService.savePurchaseOrder(this.submitForm.value).subscribe((data: any) => {
              console.log('savePurchaseOrder ' + JSON.stringify(data));

              if (data.body.result === 'success') {
                this.submitForm.reset();
                this.init();
                this.vendordata = null;
                this.submitForm.patchValue({
                  productarr: [],
                });
                this.vendorname = "";
                this.vendorselected = false;
                this.editCompletedPurchase = false;
                this.listArr = [];

                this.total = "0.00";
                this.igstTotal = "0.00";
                this.cgstTotal = "0.00";
                this.sgstTotal = "0.00";

                this._cdr.markForCheck();
                if (action === 'add') {
                  this.presentAlert('Items Added!');
                } else {
                  this.presentAlert('Saved to Draft!');
                }

              } else {
                this.presentAlert('Error: Something went wrong Contact Admin!');
              }

              this._cdr.markForCheck();
            });
          }
        }
      ]
    });

    await alert.present();
  }







  checkedRow(idx: number) {

    if (!this.listArr[idx].checkbox) {
      this.listArr[idx].checkbox = true;
      this.removeRowArr.push(idx);

    } else if (this.listArr[idx].checkbox) {
      this.listArr[idx].checkbox = false;
      this.removeRowArr = this.removeRowArr.filter(e => e !== idx);
    }
    this.delIconStatus();
    this.checkIsSingleRow();

  }

  delIconStatus() {

    if (this.removeRowArr.length > 0) {
      this.showDelIcon = true;
    } else {
      this.showDelIcon = false;
    }
  }


  onRemoveRows() {

    this.removeRowArr.sort().reverse();

    this.removeRowArr.forEach((e) => {
      this.deleteProduct(e);
    });
  }

  executeDeletes() {




    this.deletedRowArr.sort().reverse();
    this.deletedRowArr.forEach((e) => {
      this.executeDeleteProduct(e);
    });

  }


  executeDeleteProduct(elem) {


    this._commonApiService.deletePurchaseDetails({
      id: elem.pur_det_id, purchaseid: elem.purchase_id,
      autidneeded: this.editCompletedPurchase
    }).subscribe((data: any) => {


      if (data.body.result === 'success') {
        console.log('object >>> execute delete product ...')



      } else {
        this.presentAlert('Error: Something went wrong Contact Admin!');
      }

      this._cdr.markForCheck();
    });




    this._cdr.markForCheck();
  }



  async editTax() {
    // this.presentTaxValueChangeConfirm();

    const modalTax = await this._modalcontroller.create({
      component: ChangeTaxComponent,
      componentProps: { pArry: this.listArr, rArry: this.removeRowArr },
      cssClass: 'tax-edit-modal'

    });

    modalTax.onDidDismiss().then((result) => {
      console.log('The result:', result);

      if (result.data !== undefined) {
        let myCheckboxes = this.myCheckboxes.toArray();

        this.removeRowArr.forEach((idx) => {

          this.listArr[idx].taxrate = result.data;
          this.listArr[idx].checkbox = false;
          myCheckboxes[idx].checked = false;

          this.qtyChange(idx);
          this._cdr.markForCheck();

        });

        this.removeRowArr = [];

        this._cdr.markForCheck();
      }


    });
    await modalTax.present();

  }




  async editMrp() {
    // this.presentTaxValueChangeConfirm();

    const modalTax = await this._modalcontroller.create({
      component: ChangeMrpComponent,
      componentProps: { pArry: this.listArr, rArry: this.removeRowArr },
      cssClass: 'tax-edit-modal'

    });

    modalTax.onDidDismiss().then((result) => {
      console.log('The result:', result);

      if (result.data !== undefined) {
        let myCheckboxes = this.myCheckboxes.toArray();

        this.removeRowArr.forEach((idx) => {

          this.listArr[idx].mrp = result.data;
          this.listArr[idx].checkbox = false;
          myCheckboxes[idx].checked = false;
          this.listArr[idx].mrp_change_flag = 'Y'

          this.qtyChange(idx);
          this._cdr.markForCheck();

        });

        this.removeRowArr = [];

        this._cdr.markForCheck();
      }

    });
    await modalTax.present();

  }



  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are You sure to delete!!!',
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
            this.onRemoveRows();
          }
        }
      ]
    });

    await alert.present();
  }

  invoiceDateSelected($event) {
    this.maxOrderDate = $event.target.value;
  }

}
