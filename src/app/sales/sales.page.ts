import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ModalController, PickerController, AlertController } from '@ionic/angular';
import { AddProductComponent } from '../components/add-product/add-product.component';
import { CommonApiService } from '../services/common-api.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';

import { ShowCustomersComponent } from '../components/show-customers/show-customers.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthenticationService } from '../services/authentication.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  center_id: any;

  customername: string = '';
  listArr = [];
  total = "0.00";

  customer_state_code: any;
  center_state_code: any
  i_gst: any;
  customerdata: any;
  submitForm: FormGroup;

  customerselected: boolean = false;

  igst: any;
  cgst: any;
  sgst: any;

  igstTotal = "0.00";
  cgstTotal = "0.00";
  sgstTotal = "0.00";

  tax_percentage: any;
  taxable_value: any;

  fromEnquiry = false;

  cust_discount_prcnt: any;
  cust_discount_type: any;

  enqid: string;
  maxDate = new Date();


  GST_18_sub_total: any;
  GST_18_total_value: any;
  GST_18_disc: any;
  GST_18_cgst: any;
  GST_18_sgst: any;
  GST_18_igst: any;
  GST_18_gst: any;

  GST_28_sub_total: any;
  GST_28_total_value: any;
  GST_28_disc: any;
  GST_28_cgst: any;
  GST_28_sgst: any;
  GST_28_igst: any;
  GST_28_gst: any;


  @ViewChild('invno', { static: false }) inputEl: ElementRef;

  constructor(private _modalcontroller: ModalController, private _pickerctrl: PickerController,
    private _route: ActivatedRoute, private _router: Router,
    private _authservice: AuthenticationService,
    public dialog: MatDialog, public alertController: AlertController,
    private _commonApiService: CommonApiService, private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {

    const currentUser = this._authservice.currentUserValue;
    this.center_state_code = currentUser.code;
    this.center_id = currentUser.center_id;

    this.enqid = this._route.snapshot.params['enqid'];

  }

  ngOnInit() {

    this.submitForm = this._fb.group({
      customer: new FormControl(null, Validators.required),

      invoicedate: new FormControl(new Date()),

      noofitems: new FormControl(0),
      totalqty: new FormControl(0),
      value: new FormControl(0),
      totalvalue: new FormControl(0),
      igst: new FormControl(0),
      cgst: new FormControl(0),
      sgst: new FormControl(0),

      net_total: new FormControl(0),
      taxable_value: new FormControl(0),

      productarr: new FormControl(null, Validators.required),
      enqref: new FormControl(this.enqid, Validators.required)

    });


    // enquiry to Sale block. enqid = 0 is direct sale, 
    if (this.enqid !== '0') {

      this.fromEnquiry = true;

      this._commonApiService.getCustomerData(this.enqid).subscribe((custData: any) => {

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
        this._commonApiService.getEnquiredProductData(this.center_id, this.customerdata.id, this.enqid, invdt).subscribe((prodData: any) => {
          let proddata = prodData;

          proddata.forEach(element => {
            this.processItems(element);
          });

          this._cdr.markForCheck();
        });

        this._cdr.markForCheck();
      });



    }

  }



  processItems(item) {

    this.setTaxSegment(item.taxrate);

    let subtotal = 0;
    let taxableval = 0;
    let totalval = 0;
    let discval = 0;

    let qty = 0;
    if (this.enqid === '0') {
      qty = item.packetsize;
    } else {
      qty = item.qty
    }

    let disc_info = item.disc_info;
    this.cust_discount_type = disc_info.substring(disc_info.indexOf("~") + 1);
    this.cust_discount_prcnt = disc_info.substring(0, disc_info.indexOf("~"));




    if (this.cust_discount_type === 'NET') {

      subtotal = (qty * item.mrp);
      taxableval = ((qty * item.mrp) * (100 - this.cust_discount_prcnt)) / (100 + item.taxrate);
      discval = ((qty * item.mrp) * (this.cust_discount_prcnt)) / (100 + item.taxrate);
      totalval = (qty * item.mrp) * (100 - this.cust_discount_prcnt) / 100;

    } else if (this.cust_discount_type === 'GROSS') {


      subtotal = (qty * item.mrp);
      taxableval = ((qty * item.mrp) * (100 - this.cust_discount_prcnt)) / 100;
      discval = ((qty * item.mrp) * (this.cust_discount_prcnt)) / 100;
      totalval = ((qty * item.mrp) * (100 - this.cust_discount_prcnt) / 100) * (1 + (item.taxrate / 100));
    }


    // from product tblß
    this.listArr.push(
      {
        "product_id": item.id,
        "product_code": item.product_code,
        "product_desc": item.description,
        "qty": qty,
        "packetsize": item.packetsize,
        "unit_price": item.unit_price,
        "mrp": item.mrp,
        "mrp_change_flag": 'N',
        "taxrate": item.taxrate,
        "sub_total": (subtotal).toFixed(2),
        "taxable_value": (taxableval).toFixed(2),
        "disc_value": (discval).toFixed(2),
        "total_value": (totalval).toFixed(2),
        "tax_value": (totalval - taxableval).toFixed(2),

        "igst": this.igst,
        "cgst": this.cgst,
        "sgst": this.sgst,
        "igst_value": ((taxableval * this.igst) / 100).toFixed(2),
        "cgst_value": ((taxableval * this.cgst) / 100).toFixed(2),
        "sgst_value": ((taxableval * this.sgst) / 100).toFixed(2),


        "stock_pk": item.stock_pk
      });


    this.calc();


    this._cdr.markForCheck();
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

    let invdt = moment(this.submitForm.value.invoicedate).format('DD-MM-YYYY');



    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: { center_id: this.center_id, customer_id: this.customerdata.id, order_date: invdt },
      cssClass: 'select-modal'

    });

    modal.onDidDismiss().then((result) => {
      console.log('The result:', result);
      let temp = result.data;

      this.processItems(temp);

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

      let tmpnoofitems = this.listArr
        .map(arrItem => parseFloat(arrItem.qty))
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);


      this.submitForm.patchValue({
        productarr: this.listArr,
        totalqty: this.listArr.length,
        noofitems: tmpnoofitems,
        taxable_value: this.taxable_value,
        totalvalue: this.total
      });

      this.presentAlertConfirm();
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


  openNumberPad(idx, field) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0 && data != 0) {

          if (field === 'qty') {
            this.listArr[idx].qty = data;
            this.qtyChange(idx);
          } else if (field === 'mrp') {
            if (this.listArr[idx].mrp !== data) {
              this.listArr[idx].mrp = data;
              this.listArr[idx].mrp_change_flag = 'Y'
            }

          } else if (field === 'discount') {
            this.cust_discount_prcnt = data;
            this.qtyChange(idx);
          }


        }

        this._cdr.markForCheck();
      }
    );
  }

  qtyChange(idx) {

    if (this.cust_discount_type === 'NET') {
      this.listArr[idx].sub_total = (this.listArr[idx].qty * this.listArr[idx].mrp).toFixed(2);
      this.listArr[idx].total_value = ((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.cust_discount_prcnt) / 100).toFixed(2);
      this.listArr[idx].disc_value = ((this.listArr[idx].qty * this.listArr[idx].mrp) * (this.cust_discount_prcnt) / 100).toFixed(2);
      this.listArr[idx].taxable_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.cust_discount_prcnt)) / (100 + this.listArr[idx].taxrate)).toFixed(2);
      this.listArr[idx].tax_value = (this.listArr[idx].total_value - this.listArr[idx].taxable_value).toFixed(2);

    } else {
      this.listArr[idx].sub_total = (this.listArr[idx].qty * this.listArr[idx].mrp).toFixed(2);
      this.listArr[idx].total_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.cust_discount_prcnt) / 100) * (1 + (this.listArr[idx].taxrate) / 100)).toFixed(2);
      this.listArr[idx].disc_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (this.cust_discount_prcnt) / 100) * (1 + (this.listArr[idx].taxrate) / 100)).toFixed(2);
      this.listArr[idx].taxable_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.cust_discount_prcnt)) / 100).toFixed(2);
      this.listArr[idx].tax_value = (this.listArr[idx].total_value - this.listArr[idx].taxable_value).toFixed(2);

    }

    this.listArr[idx].igst_value = ((this.listArr[idx].taxable_value * this.igst) / 100).toFixed(2);
    this.listArr[idx].cgst_value = ((this.listArr[idx].taxable_value * this.cgst) / 100).toFixed(2);
    this.listArr[idx].sgst_value = ((this.listArr[idx].taxable_value * this.sgst) / 100).toFixed(2);

    this.calc();

    this._cdr.markForCheck();
  }

  calc() {

    this.GST_18_sub_total = this.listArr
      .filter(e => e.taxrate === 18.00)
      .map(e => parseFloat(e.sub_total))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_18_sub_total);

    this.GST_18_total_value = this.listArr
      .filter(e => e.taxrate === 18.00)
      .map(e => parseFloat(e.total_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_18_total_value);

    this.GST_18_disc = this.listArr
      .filter(e => e.taxrate === 18.00)
      .map(e => parseFloat(e.disc_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_18_disc);

    this.GST_18_cgst = this.listArr
      .filter(e => e.taxrate === 18.00)
      .map(e => parseFloat(e.cgst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_18_cgst);

    this.GST_18_sgst = this.listArr
      .filter(e => e.taxrate === 18.00)
      .map(e => parseFloat(e.sgst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_18_sgst);



    this.GST_18_gst = this.listArr
      .filter(e => e.taxrate === 18.00)
      .map(e => parseFloat(e.cgst_value) + parseFloat(e.sgst_value) + parseFloat(e.igst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_18_sgst);



    this.GST_28_sub_total = this.listArr
      .filter(e => e.taxrate === 28.00)
      .map(e => parseFloat(e.sub_total))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_28", this.GST_28_sub_total);

    this.GST_28_total_value = this.listArr
      .filter(e => e.taxrate === 28.00)
      .map(e => parseFloat(e.total_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_28_total_value);

    this.GST_28_disc = this.listArr
      .filter(e => e.taxrate === 28.00)
      .map(e => parseFloat(e.disc_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_28", this.GST_28_disc);

    this.GST_28_cgst = this.listArr
      .filter(e => e.taxrate === 28.00)
      .map(e => parseFloat(e.cgst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_28", this.GST_28_cgst);

    this.GST_28_sgst = this.listArr
      .filter(e => e.taxrate === 28.00)
      .map(e => parseFloat(e.sgst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_18", this.GST_28_sgst);

    this.GST_18_gst = this.listArr
      .filter(e => e.taxrate === 28.00)
      .map(e => parseFloat(e.cgst_value) + parseFloat(e.sgst_value) + parseFloat(e.igst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);
    console.log("TCL: SalesPage -> calc -> GST_28", this.GST_28_sgst);




    this.total = this.listArr
      .map(e => parseFloat(e.total_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);


    this.taxable_value = this.listArr
      .map(e => parseFloat(e.taxable_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);


    this.cgstTotal = this.listArr
      .map(e => parseFloat(e.cgst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);

    this.sgstTotal = this.listArr
      .map(e => parseFloat(e.sgst_value))
      .reduce((acc, curr) => acc + curr, 0).toFixed(2);

    if (this.i_gst) {
      this.igstTotal = this.listArr
        .map(e => parseFloat(e.igst_value))
        .reduce((acc, curr) => acc + curr, 0).toFixed(2);

      this.submitForm.patchValue({
        igst: this.igstTotal,
        cgst: 0,
        sgst: 0,
      });

    } else {

      this.submitForm.patchValue({
        cgst: this.cgstTotal,
        sgst: this.sgstTotal,
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
              console.log('Final Result.. ' + JSON.stringify(data));

              if (data.body.result === 'success') {

                this._router.navigate(['/home/enquiry/open-enquiry']);
              }

              this._cdr.markForCheck();
            });
          }
        }
      ]
    });

    await alert.present();
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
