import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CurrencyPadComponent } from 'src/app/components/currency-pad/currency-pad.component';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ModalController, AlertController, IonSearchbar } from '@ionic/angular';
import { AddProductComponent } from 'src/app/components/add-product/add-product.component';
import * as moment from 'moment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InvoiceSuccessComponent } from 'src/app/components/invoice-success/invoice-success.component';
import { AddMoreEnquiryComponent } from 'src/app/components/add-more-enquiry/add-more-enquiry.component';
import { filter, tap, catchError, debounceTime, switchMap } from 'rxjs/operators';
import * as xlsx from 'xlsx';

import { MatSort } from '@angular/material/sort';
import { Observable, empty } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Customer } from 'src/app/models/Customer';
import { CustomerAddDialogComponent } from 'src/app/components/customers/customer-add-dialog/customer-add-dialog.component';
import { MatAutocompleteTrigger, } from '@angular/material/autocomplete';
import { CustomerViewDialogComponent } from 'src/app/components/customers/customer-view-dialog/customer-view-dialog.component';
import { RequireMatch } from 'src/app/util/directives/requireMatch';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-process-enquiry',
  templateUrl: './process-enquiry.page.html',
  styleUrls: ['./process-enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessEnquiryPage implements OnInit {
  submitForm: FormGroup;

  enqDetailsOrig: any;
  selectedEnq: any;

  pageLength: any;

  productArr = [];
  customer_lis: Customer[];

  enqid: any;

  status: any;
  isTableHasData = true;

  isLoading = false;
  isCLoading = false;
  customername: any;
  customerdata: any;

  searchText = '';

  iscustomerselected = false;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  // TAB navigation for customer list
  @ViewChild('typehead1', { read: MatAutocompleteTrigger }) autoTrigger1: MatAutocompleteTrigger;

  userdata$: Observable<User>;
  userdata: any;
  ready = 0;

  constructor(private _route: ActivatedRoute, private _router: Router,
    private dialog: MatDialog, private _modalcontroller: ModalController,
    private _authservice: AuthenticationService, public alertController: AlertController,
    private _commonApiService: CommonApiService, private _dialog: MatDialog, private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef) {
    const currentUser = this._authservice.currentUserValue;
    // this.center_id = currentUser.center_id;



    this.userdata$ = this._authservice.currentUser;
    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this.ready = 1;

        this._cdr.markForCheck();
      });

    this._route.params.subscribe(params => {
      this.enqid = params['enqid'];
      if (this.userdata !== undefined) {
        this.reloadEnqDetails();
        // on reload. use this section 
        // this.submitForm.patchValue({
        //   center_id: this.userdata.center_id,
        // });
      }


    });



    this.submitForm = this._fb.group({

      customerctrl: [null, [Validators.required, RequireMatch]],

    });

  }

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;


  }

  reloadEnqDetails() {
    this._commonApiService.getEnquiryDetails(this.enqid).subscribe((data: any) => {
      this.enqDetailsOrig = data;

      this._commonApiService.getCustomerDetails(this.userdata.center_id, this.enqDetailsOrig[0].customer_id).subscribe((custData: any) => {
        this.customerdata = custData[0];


        this.submitForm.patchValue({
          customerctrl: custData[0],
        });

        this.customername = custData[0].name;
        this.iscustomerselected = true;
      });


      this.status = this.enqDetailsOrig[0].estatus;

      this.init(this.enqDetailsOrig);


      this._cdr.markForCheck();
    });
  }


  init(enqList) {
    this.productArr = [];
    enqList.forEach(element => {
      let tmpGiveqty = 0;
      if (element.status === 'D') {
        tmpGiveqty = element.giveqty === 0 ? 0 : element.giveqty;
      } else {
        tmpGiveqty = element.askqty;
      }

      this.productArr.push({
        "id": element.id, "enquiry_id": element.enquiry_id, "notes": element.notes,
        "askqty": element.askqty, "giveqty": tmpGiveqty,
        "status": "P", "invoiceno": element.invoiceno, "center_id": this.userdata.center_id,
        "customer_id": element.customer_id,
        "product_id": element.product_id,
        "product_code": element.pcode,
        "product_desc": element.pdesc,
        "rackno": element.rackno,
        "qty": element.packetsize,
        "packetsize": element.packetsize,
        "unit_price": element.unit_price,
        "mrp": element.mrp,
        "available_stock": element.available_stock,
        "stockid": element.stock_pk,
        "processed": element.processed
      });
    });

    this._cdr.markForCheck();
    this.searchCustomers();
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

  displayFn(obj: any): string | undefined {
    return obj && obj.name ? obj.name : undefined;
  }


  setCustomerInfo(event, from) {

    if (from === 'click' && event.option.value === 'new') {
      this.addCustomer();
    }

    if (from === 'tab') {

      this.customerdata = event;
      this.iscustomerselected = true;

    } else {

      this.customerdata = event.option.value;

      this.iscustomerselected = true;
    }


    this._cdr.markForCheck();

  }

  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {

        if (data != undefined && data.length > 0) {

          this.productArr[idx].giveqty = +data;

          this._cdr.markForCheck();
        }


      }
    );
  }

  async showAddProductComp(idx) {

    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: { center_id: this.userdata.center_id, customer_id: 0, },
      cssClass: 'select-modal'

    });

    modal.onDidDismiss().then((result) => {

      if (result.data !== undefined) {
        let temp = result.data;

        this.productArr[idx].product_id = temp.product_id;
        this.productArr[idx].product_code = temp.product_code;
        this.productArr[idx].product_desc = temp.description;
        this.productArr[idx].qty = temp.packetsize;
        this.productArr[idx].packetsize = temp.packetsize;
        this.productArr[idx].unit_price = temp.unit_price;
        this.productArr[idx].mrp = temp.mrp;
        this.productArr[idx].status = 'P';
        this.productArr[idx].stockid = temp.stock_pk;
        this.productArr[idx].available_stock = temp.available_stock;
        this.productArr[idx].rackno = temp.rackno;
      }

      this._cdr.markForCheck();
    });

    await modal.present();

  }




  save(param) {

    // todo - if customer is not selected throw error

    if (this.enqDetailsOrig[0].customer_id !== this.customerdata.id) {
      this.updateCustomerDetailsinEnquiry();
    }

    this._commonApiService.draftEnquiry(this.productArr).subscribe((data: any) => {

      if (data.body.result === 'success') {
        if (param === 'additem') {
          this.openAddItem();
        } else {
          this._router.navigate([`/home/enquiry/open-enquiry`]);
        }


      } else {

      }

      this._cdr.markForCheck();
    });


  }


  onClick(selItem) {
    this.selectedEnq = selItem.id;
  }

  isSelected(item) {

    if (item.id === this.selectedEnq) {
      return 'grey';
    }
  }

  checkedRow(idx) {
    setTimeout(() => {
      if (this.productArr[idx].processed === 'YS') {
        this.productArr[idx].processed = 'NO';
      } else if (this.productArr[idx].processed === 'NO') {
        this.productArr[idx].processed = 'YS';
      }


      this._cdr.markForCheck();

      this._cdr.detectChanges();
    }, 10);
  }


  moveToSale() {

    if (this.enqDetailsOrig[0].customer_id !== this.customerdata.id) {
      this.updateCustomerDetailsinEnquiry();
    }


    this._commonApiService.moveToSale(this.productArr).subscribe((data: any) => {
      if (data.body.result === 'success') {
        this._router.navigate([`/home/enquiry/open-enquiry`]);
      } else {

      }

      this._cdr.markForCheck();
    });


  }

  updateCustomerDetailsinEnquiry() {

    this._commonApiService.updateCustomerDetailsinEnquiry(this.customerdata.id, this.enqid).subscribe((data: any) => {
      if (data.body.result === 'success') {
        // do nothing
      }
    });

  }


  openEnquiry() {
    this._router.navigateByUrl(`/home/enquiry/open-enquiry`);
  }


  goEnquiryScreen() {
    this._router.navigateByUrl(`/home/enquiry`);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure, Orders processing completed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes, Move to Sale',
          handler: () => {
            console.log('Confirm Okay');
            this.moveToSale();

          }
        }
      ]
    });

    await alert.present();
  }

  async beforeAddItemConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Recent changes will be draft saved before add items.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes, go ahead',
          handler: () => {
            console.log('Confirm Okay');
            this.save('additem');

          }
        }
      ]
    });

    await alert.present();
  }


  openAddItem() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = { enquiry_id: this.enqid, center_id: this.userdata.center_id, customer_id: this.enqDetailsOrig[0].customer_id };

    const dialogRef = this.dialog.open(AddMoreEnquiryComponent, dialogConfig);



    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap((val) => {

          this.reloadEnqDetails();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


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



  reset() {

  }


  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    ws['!cols'] = [];
    ws['!cols'][1] = { hidden: true };
    ws['!cols'][4] = { hidden: true };

    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }


  logScrolling(event) {
    if (this.autoTrigger1 && this.autoTrigger1.panelOpen) {
      this.autoTrigger1.closePanel();
    }



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
            this._router.navigateByUrl('/home/enquiry/open-enquiry');

          }
        }
      ]
    });

    await alert.present();
  }



}



