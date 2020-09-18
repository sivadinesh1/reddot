import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ViewChildren, QueryList, Inject, HostListener } from '@angular/core';
import { ModalController, PickerController, AlertController } from '@ionic/angular';

import { CommonApiService } from '../services/common-api.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormGroupDirective } from '@angular/forms';

import { MatDialog, MatDialogConfig, DialogPosition } from '@angular/material/dialog';
import { CurrencyPadComponent } from '../components/currency-pad/currency-pad.component';

import { AuthenticationService } from '../services/authentication.service';
import { ChangeTaxComponent } from '../components/change-tax/change-tax.component';
import { ChangeMrpComponent } from '../components/change-mrp/change-mrp.component';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { NullToQuotePipe } from '../util/pipes/null-quote.pipe';
import { filter, tap, debounceTime, switchMap } from 'rxjs/operators';
import * as moment from 'moment';


import { SaleApiService } from '../services/sale-api.service';

import { InvoiceSuccessComponent } from '../components/invoice-success/invoice-success.component';

import { Customer } from 'src/app/models/Customer';
import { Product } from '../models/Product';
import { empty } from 'rxjs';
import { RequireMatch } from '../util/directives/requireMatch';
import { MatAutocompleteTrigger, } from '@angular/material/autocomplete';
import { IonContent } from '@ionic/angular';
import { CustomerViewDialogComponent } from '../components/customers/customer-view-dialog/customer-view-dialog.component';
import { CustomerAddDialogComponent } from '../components/customers/customer-add-dialog/customer-add-dialog.component';
import { ConvertToSaleDialogComponent } from '../components/convert-to-sale-dialog/convert-to-sale-dialog.component';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  breadmenu = "New Sale";

  listArr = [];

  total = "0.00";

  // test1: any;
  customer_state_code: any;
  center_state_code: any;
  i_gst: any;
  customerdata: any;

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
  //center_id: any;

  stockissue = "";

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

  // GST_18_sub_total: any;
  // GST_18_total_value: any;
  // GST_18_disc: any;
  // GST_18_cgst: any;
  // GST_18_sgst: any;
  // GST_18_igst: any;
  // GST_18_gst: any;

  // GST_28_sub_total: any;
  // GST_28_total_value: any;
  // GST_28_disc: any;
  // GST_28_cgst: any;
  // GST_28_sgst: any;
  // GST_28_igst: any;
  // GST_28_gst: any;

  testTotal: any;
  invoiceid: any;
  invoicedate = new Date();


  isLoading = false;
  isCLoading = false;

  iscustomerselected = false;

  lineItemData: any;
  selInvType: any;

  orig_selInvType: any;

  stock_issue_date_ref: any;
  stock_issue_ref: any;



  @ViewChild('orderno', { static: false }) orderNoEl: ElementRef;
  @ViewChildren('myCheckbox') private myCheckboxes: QueryList<any>;

  // TAB navigation for product list
  @ViewChild('typehead', { read: MatAutocompleteTrigger }) autoTrigger: MatAutocompleteTrigger;

  @ViewChild('plist') plist: any;
  @ViewChild('newrow', { static: true }) newrow: any;

  // TAB navigation for customer list
  @ViewChild('typehead1', { read: MatAutocompleteTrigger }) autoTrigger1: MatAutocompleteTrigger;
  @ViewChild(FormGroupDirective) formRef: FormGroupDirective;


  customer_lis: Customer[];
  product_lis: Product[];

  userdata$: Observable<User>;
  userdata: any;

  // @ViewChild('stickyHeaderStart', { static: true }) stickyHeaderStart: ElementRef<HTMLElement>;

  @ViewChild(IonContent, { static: false }) content: IonContent;

  question = '+ Add Customer"';
  ready = 0; // flag check - centerid (localstorage) & customerid (param)

  constructor(private _modalcontroller: ModalController, private _pickerctrl: PickerController,
    public dialog: MatDialog, public alertController: AlertController, private _router: Router,
    private _route: ActivatedRoute, private _dialog: MatDialog,
    private _authservice: AuthenticationService, private _saleApiService: SaleApiService,
    private _commonApiService: CommonApiService, private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {

    this.basicinit();


    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this._authservice.setCurrentMenu("Sale");
        this.userdata = data;


        this.submitForm.patchValue({
          center_id: data.center_id,
        })


        this.ready = 1;
        //    this.initialize();
        this._cdr.markForCheck();
      });



    this._route.data.subscribe(data => {
      this._authservice.setCurrentMenu("Sale");
      this.selInvType = "gstinvoice";
      this.listArr = [];
      this.cancel()
      this.rawSalesData = data['rawsalesdata'];


    });

    this._route.params.subscribe(params => {


      this.id = params['id'];
      this.mode = params['mode'];


      if (this.userdata !== undefined) {
        this.initialize();
      }
    });



  }


  basicinit() {
    this.submitForm = this._fb.group({
      center_id: [null],
      salesid: new FormControl('', Validators.required),

      invoiceno: [null],
      invoicedate: new FormControl(this.invoicedate, Validators.required),
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
      transport_charges: [0],
      unloading_charges: [0],
      misc_charges: [0],
      net_total: new FormControl(0),
      taxable_value: new FormControl(0),
      status: new FormControl(),
      enqref: [0],
      revision: [0],
      invoicetype: ["gstinvoice", [Validators.required]],

      customerctrl: [null, [Validators.required, RequireMatch]],
      productctrl: [null, [RequireMatch]],
      tempdesc: [''],

      tempqty: ['1', [Validators.required, Validators.max(1000), Validators.min(1), Validators.pattern(/\-?\d*\.?\d{1,2}/)]],

      productarr: new FormControl(null, Validators.required)

    });
  }



  ngOnInit() { }

  initialize() {

    this.init();

    if (this.id === "0") {
      this.getInvoiceSequence(this.userdata.center_id, "gstinvoice");
    }

    if (this.mode === 'enquiry') {

      this.getInvoiceSequence(this.userdata.center_id, "gstinvoice");

      this.submitForm.patchValue({
        enqref: this.id,
        orderno: this.id,
      })


      this.fromEnquiry = true;

      this._commonApiService.getCustomerData(this.id).subscribe((custData: any) => {

        this.customerdata = custData[0];


        this.submitForm.patchValue({
          customerctrl: custData[0],
        });

        this.customername = custData[0].name;
        this.iscustomerselected = true;

        this.setTaxLabel(custData[0].code);

        let invdt = moment(this.submitForm.value.invoicedate).format('DD-MM-YYYY');

        // prod details
        this._commonApiService.getEnquiredProductData(this.userdata.center_id, this.customerdata.id, this.id, invdt).subscribe((prodData: any) => {
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

    if (this.rawSalesData !== null && this.rawSalesData !== undefined) {

      if (this.rawSalesData[0] !== undefined) {
        if (this.rawSalesData[0].id !== 0) {
          this.breadmenu = "Edit Sale #" + this.rawSalesData[0].id;
          this.selInvType = this.rawSalesData[0].sale_type;
          this.orig_selInvType = this.rawSalesData[0].sale_type;
          this.stock_issue_ref = this.rawSalesData[0].stock_issue_ref;
          this.stock_issue_date_ref = this.rawSalesData[0].stock_issue_date_ref;

          this.submitForm.patchValue({
            salesid: this.rawSalesData[0].id,
            invoiceno: this.rawSalesData[0].invoice_no,
            invoicetype: this.rawSalesData[0].sale_type,
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

          if (this.rawSalesData[0].status === 'C' || this.rawSalesData[0].status === 'D') {
            this.editCompletedSales = true;
          }

          this._cdr.markForCheck();


          this._commonApiService.getCustomerDetails(this.userdata.center_id, this.rawSalesData[0].customer_id).subscribe((custData: any) => {

            this.customerdata = custData[0];


            this.submitForm.patchValue({
              customerctrl: custData[0],
            });

            this.customername = custData[0].name;

            this.iscustomerselected = true;

            this.setTaxLabel(custData[0].code);

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
    }


  }

  init() {

    this.searchCustomers();
    this.searchProducts();

    this._cdr.markForCheck();

  }

  // calls when invoice type select changes
  invoiceTypeChange(event) {

    if ((this.id !== "0") && (event.value === 'stockissue') && (this.mode !== 'enquiry') &&
      this.orig_selInvType !== 'stockissue') {
      this.presentAlert('Invoiced to Stock Issue Not allowed');

      this.submitForm.patchValue({
        invoicetype: "gstinvoice",
      })
      this._cdr.markForCheck();
      return false;
    } else {
      this.getInvoiceSequence(this.userdata.center_id, event.value);
    }

  }

  searchCustomers() {
    let search = "";
    this.submitForm.controls['customerctrl'].valueChanges.pipe(
      debounceTime(300),
      tap(() => this.isCLoading = true),
      switchMap(id => {
        console.log(id);
        search = id;
        if (id != null && id.length >= 2) {
          return this._commonApiService.getCustomerInfo({ "centerid": this.userdata.center_id, "searchstr": id });
        } else {
          return empty();
        }

      })

    )

      .subscribe((data: any) => {

        this.isCLoading = false;
        this.customer_lis = data.body;

        this._cdr.markForCheck();
      });
  }


  processItems(temp) {

    this.setTaxSegment(temp.taxrate);
    let subtotal = 0;
    let taxableval = 0;
    let totalval = 0;
    let discval = 0;

    let sid = '';
    if (this.rawSalesData !== null) {
      if (this.rawSalesData[0] !== undefined) {
        sid = new NullToQuotePipe().transform(this.rawSalesData[0].id);
      }
    }


    let oldval = 0;

    if (new NullToQuotePipe().transform(temp.id) !== '') {
      oldval = temp.qty;
    }

    // else part is when navigating via edit sale, 
    // when disc_info present its fresh adding products, if not, take it from saledetail tbl
    if (temp.disc_info !== undefined && temp.disc_info !== null) {
      let disc_info = temp.disc_info;
      this.cust_discount_type = disc_info.substring(disc_info.indexOf("~") + 1);
      this.cust_discount_prcnt = disc_info.substring(0, disc_info.indexOf("~"));

    } else {
      this.cust_discount_type = temp.disc_type;
      this.cust_discount_prcnt = temp.disc_percent;
    }


    if (this.cust_discount_type === 'NET') {

      subtotal = (temp.qty * temp.mrp);
      taxableval = ((temp.qty * temp.mrp) * (100 - this.cust_discount_prcnt)) / (100 + temp.taxrate);
      discval = ((temp.qty * temp.mrp) * (this.cust_discount_prcnt)) / (100 + temp.taxrate);
      totalval = (temp.qty * temp.mrp) * (100 - this.cust_discount_prcnt) / 100;

    } else if (this.cust_discount_type === 'GROSS') {


      subtotal = (temp.qty * temp.mrp);
      taxableval = ((temp.qty * temp.mrp) * (100 - this.cust_discount_prcnt)) / 100;
      discval = ((temp.qty * temp.mrp) * (this.cust_discount_prcnt)) / 100;
      totalval = ((temp.qty * temp.mrp) * (100 - this.cust_discount_prcnt) / 100) * (1 + (temp.taxrate / 100));
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


        "sub_total": (subtotal).toFixed(2),
        "taxable_value": (taxableval).toFixed(2),
        "disc_value": (discval).toFixed(2),
        "disc_percent": this.cust_discount_prcnt,
        "disc_type": this.cust_discount_type,
        "total_value": (totalval).toFixed(2),
        "tax_value": (totalval - taxableval).toFixed(2),

        "igst": this.igst,
        "cgst": this.cgst,
        "sgst": this.sgst,
        "old_val": oldval,
        "stock_pk": temp.stock_pk,
        "del_flag": 'N',
        "margin": ((totalval / temp.qty) - temp.unit_price) < 0 ? "marginNeg" : ""
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

    let v1 = document.documentElement.clientHeight + 70;

    this.ScrollToPoint(0, v1);


    this._cdr.markForCheck();

  }



  clearInput() {
    this.submitForm.patchValue({
      customerctrl: null,
    });

    this.iscustomerselected = false;

    this._cdr.markForCheck();

  }


  sumTotalTax() {


    if (this.i_gst) {

      this.igstTotal = this.listArr
        .map(item => { return (+item.tax_value); }) // convert to number using +
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

      console.log('dines' + this.igstTotal);
      this.submitForm.patchValue({
        igst: this.igstTotal,
        cgst: 0,
        sgst: 0,
      });


    } else {

      this.cgstTotal = this.listArr.map(item => {

        return item.tax_value / 2;
      })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

      this.sgstTotal = this.listArr.map(item => {

        return item.tax_value / 2;
      })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);
      console.log('cgstTotal' + this.cgstTotal);
      console.log('sgstTotal' + this.sgstTotal);

      this.submitForm.patchValue({
        cgst: this.cgstTotal,
        sgst: this.sgstTotal,
        igst: 0,
      });

    }
    this._cdr.markForCheck();

  }


  ngAfterViewInit() {
    this.autoTrigger && this.autoTrigger.panelClosingActions.subscribe(x => {
      if (this.autoTrigger.activeOption) {

        this.submitForm.patchValue({
          productctrl: this.autoTrigger.activeOption.value
        });
        this.setItemDesc(this.autoTrigger.activeOption.value, "tab");

      }
    })

    this.autoTrigger1 && this.autoTrigger1.panelClosingActions.subscribe(x => {
      if (this.autoTrigger1.activeOption) {

        this.submitForm.patchValue({
          customerctrl: this.autoTrigger1.activeOption.value
        });
        this.setCustomerInfo(this.autoTrigger1.activeOption.value, "tab");
      }
    })


    // const stickyHeaderOptions = {
    //   rootMargin: "0px 0px -20px 0px"
    // };

    // const appearOptions = {
    //   threshold: 0,
    //   rootMargin: "0px 0px -200px 0px"
    // };

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

    if (this.i_gst) {
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

  setTaxLabel(customer_state_code) {

    if (customer_state_code !== this.userdata.code) {
      this.i_gst = true;

    } else {
      this.i_gst = false;


    }

  }


  validateForms() {


    if (this.submitForm.value.invoicedate == null) {
      this.presentAlert('Enter Invoice Date!');
      return false;
    }

    if (this.submitForm.value.invoicedate !== null && (this.submitForm.value.orderdate !== "" && this.submitForm.value.orderdate != null)) {
      if ((this.submitForm.value.orderno === "") && this.submitForm.value.orderdate != null) {
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

    if (this.submitForm.value.invoicedate !== null && (this.submitForm.value.lrdate !== "" && this.submitForm.value.lrdate !== null)) {
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
        } else if (action === 'print') {
          this.presentAlertConfirm('print');
        } else if (action === 'draft') {
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

  getNetTotal() {

    let tmp = parseFloat(this.total) + parseFloat(this.submitForm.value.transport_charges || 0) +
      parseFloat(this.submitForm.value.unloading_charges || 0) +
      parseFloat(this.submitForm.value.misc_charges || 0);
    return tmp.toFixed(2);
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alert',

      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }



  invoiceSuccess(invoice_id) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "80%";
    dialogConfig.data = this.invoiceid;

    const dialogRef = this.dialog.open(InvoiceSuccessComponent, dialogConfig);

    dialogRef.afterClosed();
  }


  convertToInvoiceSuccess(invoice_id, invoice_date) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = { "invoiceid": invoice_id, "invoicedate": invoice_date };

    const dialogRef = this.dialog.open(ConvertToSaleDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('The dialog was closed');
      this._router.navigateByUrl('/home/search-sales');
    });
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


  openRowNumberPad(idx, field) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap((val) => {

          if (val <= 100) {
            this.listArr[idx].disc_percent = val;
            this.qtyChange(idx);
          } else {
            return false;
          }
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }

  qtyChange(idx) {

    if (this.cust_discount_type === 'NET') {
      this.listArr[idx].sub_total = (this.listArr[idx].qty * this.listArr[idx].mrp).toFixed(2);

      this.listArr[idx].total_value = ((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.listArr[idx].disc_percent) / 100).toFixed(2);
      this.listArr[idx].disc_value = ((this.listArr[idx].qty * this.listArr[idx].mrp) * (this.listArr[idx].disc_percent) / 100).toFixed(2);
      this.listArr[idx].taxable_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.listArr[idx].disc_percent)) / (100 + this.listArr[idx].taxrate)).toFixed(2);
      this.listArr[idx].tax_value = (this.listArr[idx].total_value - this.listArr[idx].taxable_value).toFixed(2);


    } else {
      this.listArr[idx].sub_total = (this.listArr[idx].qty * this.listArr[idx].mrp).toFixed(2);
      this.listArr[idx].total_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.listArr[idx].disc_percent) / 100) * (1 + (this.listArr[idx].taxrate) / 100)).toFixed(2);
      this.listArr[idx].disc_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (this.listArr[idx].disc_percent) / 100) * (1 + (this.listArr[idx].taxrate) / 100)).toFixed(2);
      this.listArr[idx].taxable_value = (((this.listArr[idx].qty * this.listArr[idx].mrp) * (100 - this.listArr[idx].disc_percent)) / 100).toFixed(2);
      this.listArr[idx].tax_value = (this.listArr[idx].total_value - this.listArr[idx].taxable_value).toFixed(2);

    }

    this.listArr[idx].margin = ((this.listArr[idx].total_value / this.listArr[idx].qty) - this.listArr[idx].unit_price) < 0 ? "marginNeg" : "";

    this.calc();

    this._cdr.markForCheck();
  }

  calc() {

    const tempArr = this.listArr.map(arrItem => {
      return parseFloat(arrItem.taxable_value) + parseFloat(arrItem.tax_value);
    }
    );

    const tempArrCostPrice = this.listArr.map(arr => {
      return parseFloat(arr.unit_price) * parseFloat(arr.qty);
    })

    // this.testTotal = tempArr;

    this.total = tempArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2);

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


  marginCheck(margin) {

    if (margin === 'marginNeg') {
      return "marginneg";
    }

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

            if (action === 'add' || action === 'print') {
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
                this.invoiceid = data.body.id;

                this.cancel();
                // this.submitForm.reset();
                this.formRef.resetForm();




                // reinit after successful insert
                this.getInvoiceSequence(this.userdata.center_id, "gstinvoice");

                this._cdr.markForCheck();
                if (action === 'add') {
                  this.invoiceSuccess(this.invoiceid);
                  // invoice add dialog
                } else {
                  this.presentAlert('Saved to Draft!');
                }

                this.submitForm.patchValue({
                  invoicedate: new Date(),
                });

                this.salesDashboard();

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


  // Fn: to get & set invoiceno and invoice type
  getInvoiceSequence(centerid, invoicetype) {

    this._saleApiService.getNxtSaleInvoiceNo(centerid, invoicetype).subscribe((data: any) => {

      this.submitForm.patchValue({
        invoiceno: data[0].NxtInvNo,
        invoicetype: invoicetype
      });

      this.selInvType = invoicetype;
      this._cdr.markForCheck();
    });

  }


  async presentCancelConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure to leave the page?',
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
            // this.cancel();
            this._router.navigateByUrl('/home/search-sales');

          }
        }
      ]
    });

    await alert.present();
  }


  async presentConvertSaleConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'This change cannot be rolled back. Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Convert to sale',
          handler: () => {
            console.log('Confirm Okay');

            this.convertToSale();

          }
        }
      ]
    });

    await alert.present();
  }

  cancel() {
    //  this.submitForm.reset();
    //  this.init();
    this.customerdata = null;
    // this.submitForm.patchValue({
    //   productarr: [],
    // });
    this.customername = "";
    this.iscustomerselected = false;
    this.editCompletedSales = false;
    this.listArr = [];

    this.total = "0.00";
    this.igstTotal = "0.00";
    this.cgstTotal = "0.00";
    this.sgstTotal = "0.00";


    this.customer_lis = null;



  }


  convertToSale() {
    // pass sale id and call backend 
    // refresh the page with latest values (invoice # and inv type)

    this._commonApiService.convertToSale({
      "center_id": this.userdata.center_id, "sales_id": this.id,
      "old_invoice_no": this.submitForm.value.invoiceno, "old_stock_issued_date": this.submitForm.value.invoicedate
    })
      .subscribe((data: any) => {
        console.log('object');

        if (data.body.result === 'success') {

          // this.submitForm.patchValue({
          //   invoiceno: data.invoiceNo,
          //   invoicetype: "gstinvoice",
          //   invoicedate: new Date(new NullToQuotePipe().transform(moment().format('DD-MM-YYYY')).replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')),
          // });
          // this.selInvType = "gstinvoice";

          // this.presentAlert('Converted to sale invoice!!');
          this.convertToInvoiceSuccess(data.body.invoiceNo, moment().format('DD-MM-YYYY'));

        }
      });


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
      id: elem.sale_det_id, salesid: elem.sales_id, qty: elem.qty,
      product_id: elem.product_id, stock_id: elem.stock_pk,
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

        this.delIconStatus();
        this.checkIsSingleRow();

        this._cdr.markForCheck();
      }


    });
    await modalTax.present();

  }

  async editMrp() {

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

        this.delIconStatus();
        this.checkIsSingleRow();

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



  // clearInput() {
  //   this.submitForm.patchValue({
  //     customer: null,
  //     customerctrl: null
  //   });
  //   this.customer_lis = null;
  //   this.customerdata = null;

  //   this.iscustomerselected = false;
  //   this._cdr.markForCheck();

  // }

  clearProdInput() {

    this.submitForm.patchValue({
      productctrl: null,

      tempdesc: null,
      tempqty: 1
    });
    this.product_lis = null;
    this._cdr.markForCheck();

  }

  setItemDesc(event, from) {

    if (from === 'tab') {
      this.submitForm.patchValue({
        tempdesc: event.description,
        tempqty: event.qty
      });
      this.lineItemData = event;
    } else {
      this.submitForm.patchValue({
        tempdesc: event.option.value.description,
        tempqty: event.option.value.qty
      });
      this.lineItemData = event.option.value;
    }

    this._cdr.markForCheck();

  }


  displayFn(obj: any): string | undefined {
    return obj && obj.name ? obj.name : undefined;
  }

  displayProdFn(obj: any): string | undefined {
    return obj && obj.product_code ? obj.product_code : undefined;

  }

  getLength() {
    const control = <FormArray>this.submitForm.controls['productarr'];
    return control.length;
  }

  searchProducts() {

    let invdt = "";
    if (this.submitForm.value.invoicedate === null) {
      invdt = moment().format('DD-MM-YYYY');
    } else {
      invdt = moment(this.submitForm.value.invoicedate).format('DD-MM-YYYY');
    }

    this.submitForm.controls['productctrl'].valueChanges.pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap(id => {

        if (id != null && id.length >= 2) {
          return this._commonApiService.getProductInformation({ "centerid": this.userdata.center_id, "customerid": this.customerdata.id, "orderdate": invdt, "searchstr": id });
        } else {
          return empty();
        }

      })

    )

      .subscribe((data: any) => {
        this.isLoading = false;
        this.product_lis = data.body;

        this._cdr.markForCheck();
      });
  }

  // Navigation 
  salesDashboard() {
    this._router.navigateByUrl('/home/search-sales');
  }


  add() {
    let invdt = "";
    if (this.submitForm.value.invoicedate === null) {
      invdt = moment().format('DD-MM-YYYY');
    } else {
      invdt = moment(this.submitForm.value.invoicedate).format('DD-MM-YYYY');
    }


    if (this.submitForm.value.tempdesc === '' || this.submitForm.value.tempdesc === null) {
      this.submitForm.controls['tempdesc'].setErrors({ 'required': true });
      this.submitForm.controls['tempdesc'].markAsTouched();

      return false;
    }

    if (this.submitForm.value.tempqty === '' || this.submitForm.value.tempqty === null) {
      this.submitForm.controls['tempqty'].setErrors({ 'required': true });
      this.submitForm.controls['tempqty'].markAsTouched();

      return false;
    }

    if (this.submitForm.value.customerctrl === '' || this.submitForm.value.customerctrl === null) {
      this.submitForm.controls['customerctrl'].setErrors({ 'required': true });
      this.submitForm.controls['customerctrl'].markAsTouched();

      return false;
    }

    // this line over writes default qty vs entered qty
    this.lineItemData.qty = this.submitForm.value.tempqty;

    // lineitemdata is the input box row to add items
    this.processItems(this.lineItemData);

    this.submitForm.patchValue({
      productctrl: "",
      tempdesc: "",
      tempqty: 1,
    });

    this.submitForm.controls['tempdesc'].setErrors(null);
    this.submitForm.controls['tempqty'].setErrors(null);
    this.submitForm.controls['productctrl'].setErrors(null);
    this.plist.nativeElement.focus();


    this._cdr.markForCheck();

  }

  setCustomerInfo(event, from) {

    if (from === 'click' && event.option.value === 'new') {
      this.addCustomer();
    }

    if (from === 'tab') {
      this.customer_state_code = event.code;
      this.cust_discount_prcnt = event.discount;
      this.cust_discount_type = event.discount_type;

      this.customerdata = event;
      this.iscustomerselected = true;

    } else {

      this.customer_state_code = event.option.value.code;
      this.cust_discount_prcnt = event.option.value.discount;
      this.cust_discount_type = event.option.value.discount_type;
      this.customerdata = event.option.value;



      this.iscustomerselected = true;
    }
    this.setTaxLabel(this.customer_state_code);

    this._cdr.markForCheck();

  }


  ScrollToBottom() {
    this.content.scrollToBottom(1500);
  }

  ScrollToTop() {
    this.content.scrollToTop(1500);
  }

  ScrollToPoint(X, Y) {
    this.content.scrollToPoint(X, Y, 300);
  }

  openDialog(event): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";
    dialogConfig.height = "100%";
    dialogConfig.data = this.customerdata;
    dialogConfig.position = { top: '0', right: '0' };

    const dialogRef = this._dialog.open(CustomerViewDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  addCustomer() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";

    const dialogRef = this._dialog.open(CustomerAddDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          // do nothing check
          this._cdr.markForCheck();
        }
        )
      ).subscribe((data: any) => {
        if (data !== 'close') {

          this._commonApiService.getCustomerDetails(this.userdata.center_id, data.body.id).subscribe((custData: any) => {

            this.customerdata = custData[0];

            this.customername = custData[0].name;
            this.iscustomerselected = true;

            this.setTaxLabel(custData[0].code);

            this.setCustomerInfo(custData[0], "tab");

            this.submitForm.patchValue({
              customerctrl: custData[0]
            });

            this.isCLoading = false;
            this.autoTrigger1.closePanel();

            this._cdr.markForCheck();
          });
        } else {

          this.iscustomerselected = false;
          this.autoTrigger1.closePanel();

          this._cdr.markForCheck();
        }



        this._cdr.markForCheck();
      });


  }


  logScrolling(event) {
    if (this.autoTrigger1 && this.autoTrigger1.panelOpen) {
      this.autoTrigger1.closePanel();
    }

    if (this.autoTrigger && this.autoTrigger.panelOpen) {
      this.autoTrigger.closePanel();
    }

  }
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander($event) {
    $event.returnValue = 'Your changes will not be saved';

    return true;

  }

}
