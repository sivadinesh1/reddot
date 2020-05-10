import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ModalController, PickerController, AlertController } from '@ionic/angular';
import { AddProductComponent } from '../components/add-product/add-product.component';
import { CommonApiService } from '../services/common-api.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { PickerOptions } from '@ionic/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';

import { AuthenticationService } from '../services/authentication.service';
import { ChangeTaxComponent } from '../components/change-tax/change-tax.component';
import { ChangeMrpComponent } from '../components/change-mrp/change-mrp.component';
import { Route, ActivatedRoute } from '@angular/router';
import { NullToQuotePipe } from '../util/pipes/null-quote.pipe';
import { filter, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';
import { SaleApiService } from '../services/sale-api.service';
import { async } from 'rxjs/internal/scheduler/async';
import { InvoiceSuccessComponent } from '../components/invoice-success/invoice-success.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {


  listArr = [];

  total = "0.00";

  test1: any;
  customer_state_code: any;
  center_state_code: any
  i_gst: any;
  customerdata: any;
  customerselected: boolean = false;
  submitForm: FormGroup;

  customername: string = '';

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
  salesid: any;
  rawSalesData: any;

  maxDate = new Date();
  maxOrderDate = new Date();

  editCompletedSales: any;


  cust_discount_prcnt: any;
  cust_discount_type: any;
  mode: string;
  id: string;
  fromEnquiry: any;


  @ViewChild('orderno', { static: false }) orderNoEl: ElementRef;
  @ViewChildren('myCheckbox') private myCheckboxes: QueryList<any>;

  constructor(private _modalcontroller: ModalController, private _pickerctrl: PickerController,
    public dialog: MatDialog, public alertController: AlertController,
    private _route: ActivatedRoute,
    private _authservice: AuthenticationService, private _saleApiService: SaleApiService,
    private _commonApiService: CommonApiService, private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {

    const currentUser = this._authservice.currentUserValue;
    this.center_state_code = currentUser.code;
    this.center_id = currentUser.center_id;

    this._route.data.subscribe(data => {
      this.rawSalesData = data['rawsalesdata'];

      this.id = this._route.snapshot.params['id'];
      this.mode = this._route.snapshot.params['mode'];
      this.initialize();
    });



  }
  ngOnInit() {
  }

  initialize() {


    this.init();


    this.customerselected = false;

    if (this.mode === 'enquiry') {

      this.submitForm.patchValue({
        enqref: this.id,
        orderno: this.id,
      })


      this.fromEnquiry = true;

      this._commonApiService.getCustomerData(this.id).subscribe((custData: any) => {

        this.customerdata = custData[0];
        this.customer_state_code = custData[0].code;

        this.submitForm.patchValue({
          customer: custData[0],
        });

        this.customername = custData[0].name;
        this.customerselected = true;

        // this.cust_discount_prcnt = custData[0].discount;
        // this.cust_discount_type = custData[0].discount_type;


        this.setTaxLabel();
        this.setTaxSegment(custData.taxrate);

        let invdt = moment(this.submitForm.value.invoicedate).format('DD-MM-YYYY');

        // prod details
        this._commonApiService.getEnquiredProductData(this.center_id, this.customerdata.id, this.id, invdt).subscribe((prodData: any) => {
          let proddata = prodData;


          this.submitForm.patchValue({
            orderdate: (proddata[0].enquiry_date !== '' || proddata[0].enquiry_date !== undefined) ? proddata[0].enquiry_date : ''
          })

          proddata.forEach(element => {
            this.processItems(element);
          });

          this._cdr.markForCheck();
        });

        this._cdr.markForCheck();
      });




    }

    if (this.rawSalesData !== null) {


      if (this.rawSalesData[0] !== undefined && this.rawSalesData[0].id !== 0) {

        this.submitForm.patchValue({
          salesid: this.rawSalesData[0].id,
          invoiceno: this.rawSalesData[0].invoice_no,
          invoicedate: new Date(new NullToQuotePipe().transform(this.rawSalesData[0].invoice_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),

          orderdate: this.rawSalesData[0].order_date === '' ? '' : new Date(new NullToQuotePipe().transform(this.rawSalesData[0].order_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),

          lrno: this.rawSalesData[0].lr_no,

          lrdate: this.rawSalesData[0].lr_date === '' ? '' : new Date(new NullToQuotePipe().transform(this.rawSalesData[0].lr_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),
          orderno: this.rawSalesData[0].order_no,
          noofboxes: this.rawSalesData[0].no_of_boxes,

          orderrcvddt: this.rawSalesData[0].received_date === '' ? '' : new Date(new NullToQuotePipe().transform(this.rawSalesData[0].received_date).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),


          noofitems: this.rawSalesData[0].no_of_items,
          totalqty: this.rawSalesData[0].total_qty,
          value: this.rawSalesData[0].total_value,
          totalvalue: this.rawSalesData[0].total_value,
          igst: this.rawSalesData[0].igst,
          cgst: this.rawSalesData[0].cgst,
          sgst: this.rawSalesData[0].sgst,
          transport_charges: this.rawSalesData[0].transport_charges,
          unloading_charges: this.rawSalesData[0].unloading_charges,
          misc_charges: this.rawSalesData[0].misc_charges,
          net_total: this.rawSalesData[0].net_total,
          taxable_value: this.rawSalesData[0].taxable_value,
          status: this.rawSalesData[0].status,
          revision: this.rawSalesData[0].revision

        });

        if (this.rawSalesData[0].status === 'C') {
          this.editCompletedSales = true;
        }

        this._cdr.markForCheck();


        this._commonApiService.getCustomerDetails(this.center_id, this.rawSalesData[0].customer_id).subscribe((custData: any) => {

          this.customerdata = custData[0];
          this.customer_state_code = custData[0].code;

          this.submitForm.patchValue({
            customer: custData[0],
          });

          this.customername = custData[0].name;
          this.customerselected = true;




          //this.vendorstate = custData[0].state;

          this.setTaxLabel();
          this.setTaxSegment(custData[0].taxrate);

          this._cdr.markForCheck();
        });


        this._commonApiService.saleDetails(this.rawSalesData[0].id).subscribe((saleData: any) => {
          let sData = saleData;

          sData.forEach(element => {
            this.processItems(element);
          });
        });


        this._cdr.markForCheck();

      }
    }
    if (this.id === '0') {
      this._saleApiService.getNxtSaleInvoiceNo(this.center_id).subscribe((data: any) => {

        this.submitForm.patchValue({
          invoiceno: data[0].NxtInvNo,
        });
      });
    }

  }

  init() {
    this.submitForm = this._fb.group({
      center_id: [this.center_id],
      salesid: new FormControl('', Validators.required),
      customer: [null, Validators.required],
      invoiceno: [null],
      invoicedate: new FormControl(null, Validators.required),
      orderno: new FormControl(''),
      orderdate: new FormControl(''),
      lrno: new FormControl(''),
      lrdate: new FormControl(''),
      noofboxes: new FormControl(0),
      orderrcvddt: new FormControl(''),
      noofitems: [0],
      totalqty: [0],
      value: new FormControl(0),
      totalvalue: new FormControl(0),
      igst: new FormControl(0),
      cgst: [0],
      sgst: new FormControl(0),
      transport_charges: new FormControl(0),
      unloading_charges: new FormControl(0),
      misc_charges: new FormControl(0),
      net_total: new FormControl(0),
      taxable_value: new FormControl(0),
      status: new FormControl('D'),
      enqref: [0],
      revision: [0],

      productarr: new FormControl(null, Validators.required)

    });
  }



  async showAllCustomersComp() {

    const modal = await this._modalcontroller.create({
      component: ShowCustomersComponent,
      cssClass: 'customer-comp-styl'

    });


    modal.onDidDismiss().then((result) => {
      let custData = result.data;

      this.customer_state_code = custData.code;
      this.cust_discount_prcnt = custData.discount;
      this.cust_discount_type = custData.discount_type;


      this.submitForm.patchValue({
        customer: custData,
      });

      this.customerdata = custData;
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


    let sid = '';
    if (this.rawSalesData !== null) {
      if (this.rawSalesData[0] !== undefined) {
        sid = new NullToQuotePipe().transform(this.rawSalesData[0].id);
      }
    }


    let oldval = 0;

    if (new NullToQuotePipe().transform(temp.id) !== '' && this.editCompletedSales) {
      oldval = temp.qty;
    }


    // from product tbl
    this.listArr.push(
      {
        "sales_id": sid,
        "sale_det_id": new NullToQuotePipe().transform(temp.id),
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
        "old_val": oldval,
        "stock_pk": temp.stock_pk,
        "del_flag": 'N'
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


    if (this.listArr[idx].sale_det_id != '') {

      this.listArr[idx].del_flag = 'Y';
      this.deletedRowArr.push(this.listArr[idx]);
    }
    this.listArr.splice(idx, 1);
    this.removeRowArr = this.removeRowArr.filter(e => e !== idx);

    this.delIconStatus();
    this.checkIsSingleRow();
    this.calc();



    // this._commonApiService.deleteSalesDetails({
    //   id: this.listArr[idx].sale_det_id, salesid: this.listArr[idx].sales_id,
    //   autidneeded: this.editCompletedSales
    // }).subscribe((data: any) => {


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
    // } else {
    //   this.listArr.splice(idx, 1);
    //   this.removeRowArr = this.removeRowArr.filter(e => e !== idx);

    //   this.delIconStatus();
    //   this.checkIsSingleRow();
    //   this.calc();
    // }



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

  // // draft - status
  // onSave(action) {
  //   this.submitForm.patchValue({
  //     status: 'D',
  //   });
  //   this.onSubmit(action);
  // }

  // // final c completed - status
  // onSavenSubmit(action) {
  //   this.submitForm.patchValue({
  //     status: 'C',
  //   });
  //   this.onSubmit(action);
  // }


  validateForms() {


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


      if (moment(this.submitForm.value.orderdate).format('DD-MM-YYYY') >
        moment(this.submitForm.value.invoicedate).format('DD-MM-YYYY')) {
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

  selectCustomer() {

    let customervalue = this.submitForm.value.customer;
    console.log('print list ' + JSON.stringify(customervalue));
    this.customer_state_code = customervalue.code;
    this.customerselected = true;
    this.setTaxLabel();

    this._cdr.markForCheck();
  }




  invoiceSuccess() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "80%";
    // dialogConfig.data = vendor;

    const dialogRef = this.dialog.open(InvoiceSuccessComponent, dialogConfig);

    dialogRef.afterClosed();



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


            this._commonApiService.saveSaleOrder(this.submitForm.value).subscribe((data: any) => {
              console.log('saveSaleOrder ' + JSON.stringify(data));

              if (data.body.result === 'success') {
                this.submitForm.reset();
                this.init();
                this.customerdata = null;
                this.submitForm.patchValue({
                  productarr: [],
                });
                this.customername = "";
                this.customerselected = false;
                this.editCompletedSales = false;
                this.listArr = [];

                this.total = "0.00";
                this.igstTotal = "0.00";
                this.cgstTotal = "0.00";
                this.sgstTotal = "0.00";


                this._saleApiService.getNxtSaleInvoiceNo(this.center_id).subscribe((data: any) => {

                  this.submitForm.patchValue({
                    invoiceno: data[0].NxtInvNo,
                  });
                });

                this._cdr.markForCheck();
                if (action === 'add') {
                  //this.presentAlert('Invoice Completed!');
                  this.invoiceSuccess();
                  // invoice add dialog
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


    this._commonApiService.deleteSalesDetails({
      id: elem.sale_det_id, salesid: elem.sales_id,
      autidneeded: this.editCompletedSales
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

  onPrint() {
    this._commonApiService.print().subscribe((data: any) => {
      console.log('object...PRINTED');


      const blob = new Blob([data], { type: 'application/pdf' });

      // to save as file in ionic projects dnd
      // FileSaver.saveAs(blob, '_export_' + new Date().getTime() + '.pdf');

      // dnd - opens as iframe and ready for print (opens with print dialog box)
      // const blobUrl = URL.createObjectURL(blob);
      // const iframe = document.createElement('iframe');
      // iframe.style.display = 'none';
      // iframe.src = blobUrl;
      // document.body.appendChild(iframe);
      // iframe.contentWindow.print();


      // dnd to open in new tab - does not work with pop up blocked
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.target = "_blank";
      link.click();
      // if need to download with file name
      //  link.download = "filename.ext"



      // dnd - if need to do anyhting on click - not much use
      // link.onclick = function () {
      //   window.open(window.URL.createObjectURL(blob),
      //     '_blank',
      //     'width=300,height=250');
      //   return false;
      // };


      // var newWin = window.open(url);             
      // if(!newWin || newWin.closed || typeof newWin.closed=='undefined') 
      // { 
      //POPUP BLOCKED
      // }


    });
  }

}

