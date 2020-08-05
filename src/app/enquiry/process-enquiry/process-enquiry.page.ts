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
import { filter, tap, catchError } from 'rxjs/operators';
import * as xlsx from 'xlsx';


import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-process-enquiry',
  templateUrl: './process-enquiry.page.html',
  styleUrls: ['./process-enquiry.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcessEnquiryPage implements OnInit {

  enqDetailsOrig: any;
  selectedEnq: any;

  pageLength: any;

  productArr = [];

  enqid: any;
  center_id: any;

  status: any;
  isTableHasData = true;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

  displayedColumns: string[] = ['edit', 'prodinfo', 'avlstock', 'rackno', 'alotqty', 'notes', 'reqqty'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;


  constructor(private _route: ActivatedRoute, private _router: Router,
    private dialog: MatDialog, private _modalcontroller: ModalController,
    private _authservice: AuthenticationService, public alertController: AlertController,
    private _commonApiService: CommonApiService,
    private _cdr: ChangeDetectorRef) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.enqid = this._route.snapshot.params['enqid'];
    this._commonApiService.getEnquiryDetails(this.enqid).subscribe((data: any) => {
      this.enqDetailsOrig = data;

      // this.dataSource.data = data.map(el => {
      //   var o = Object.assign({}, el);
      //   o.isExpanded = false;
      //   return o;
      // })

      // this.dataSource.sort = this.sort;
      // this.pageLength = data.length;

      this.status = this.enqDetailsOrig[0].estatus;

      this.init(this.enqDetailsOrig);


      this._cdr.markForCheck();
    });
  }


  init(enqList) {
    enqList.forEach(element => {
      let tmpGiveqty = 0;
      if (element.status === 'D') {
        tmpGiveqty = element.giveqty || 1;
      } else {
        tmpGiveqty = element.askqty;
      }

      this.productArr.push({
        "id": element.id, "enquiry_id": element.enquiry_id, "notes": element.notes,
        "askqty": element.askqty, "giveqty": tmpGiveqty,
        "status": "P", "invoiceno": element.invoiceno, "center_id": this.center_id,
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

    this.dataSource.data = this.productArr.map(el => {
      var o = Object.assign({}, el);
      o.isExpanded = false;
      return o;
    })

    this.dataSource.sort = this.sort;
    this.pageLength = this.productArr.length;


  }

  openCurrencyPad(idx) {

    const dialogRef = this.dialog.open(CurrencyPadComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(
      data => {
        if (data != undefined && data.length > 0) {

          this.productArr[idx].giveqty = +data;
          this.dataSource.data = this.productArr;

          // this._cdr.detectChanges();
        }

        this._cdr.markForCheck();
      }
    );
  }

  async showAddProductComp(idx) {

    // console.log('object ' + JSON.stringify(this.productArr));

    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: { center_id: this.center_id, customer_id: 0, },
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
      this.dataSource.data = this.productArr;
      this._cdr.markForCheck();
    });

    await modal.present();

  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if (this.dataSource.filteredData.length > 0) {
      this.isTableHasData = true;
    } else {
      this.isTableHasData = false;
    }

  }

  save() {

    this._commonApiService.draftEnquiry(this.productArr).subscribe((data: any) => {

      if (data.body.result === 'success') {

        this._router.navigate([`/home/enquiry/open-enquiry`]);

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
      this._cdr.detectChanges();
    }, 10);
  }


  moveToSale() {
    this._commonApiService.moveToSale(this.productArr).subscribe((data: any) => {
      if (data.body.result === 'success') {
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


  openAddItem() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = { enquiry_id: this.enqid, center_id: this.center_id, customer_id: this.enqDetailsOrig[0].customer_id };

    const dialogRef = this.dialog.open(AddMoreEnquiryComponent, dialogConfig);



    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap((val) => {

          this.init(val);
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }

  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    // delete (ws['O1'])

    ws['!cols'] = [];
    ws['!cols'][0] = { hidden: true };

    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'enquiry.xlsx');
  }

  reset() {

  }

}



