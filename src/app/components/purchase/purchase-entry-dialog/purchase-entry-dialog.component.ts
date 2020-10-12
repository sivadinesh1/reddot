import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/Customer';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from 'src/app/services/common-api.service';
import { CustomerViewDialogComponent } from '../../customers/customer-view-dialog/customer-view-dialog.component';
import * as xlsx from 'xlsx';
import { InvoiceSuccessComponent } from '../../invoice-success/invoice-success.component';

@Component({
  selector: 'app-purchase-entry-dialog',
  templateUrl: './purchase-entry-dialog.component.html',
  styleUrls: ['./purchase-entry-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PurchaseEntryDialogComponent implements OnInit {

  purchasemasterdata: any;
  purchasedetailsdata: any;
  customerdata: any;
  centerdata: any;

  data: any;

  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<PurchaseEntryDialogComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) data: any, public _dialog: MatDialog,
    private _commonApiService: CommonApiService) {
    this.data = data;

  }

  ngOnInit() {

    this._commonApiService.purchaseMasterData(this.data.id).subscribe((data: any) => {

      this.purchasemasterdata = data[0];

      this._cdr.markForCheck();
    })

    this._commonApiService.purchaseDetails(this.data.id).subscribe((data: any) => {

      this.purchasedetailsdata = data;

      this._cdr.markForCheck();
    })

    this._commonApiService.getVendorDetails(this.data.center_id, this.data.vendor_id).subscribe((data: any) => {

      this.customerdata = data[0];

      this._cdr.markForCheck();
    })




  }


  close() {
    this.dialogRef.close();
  }


  exportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    ws['!cols'] = [];
    ws['!cols'][1] = { hidden: true };
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'epltable.xlsx');
  }


  goPrintInvoice(row) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = row.id;

    const dialogRef = this._dialog.open(InvoiceSuccessComponent, dialogConfig);

    dialogRef.afterClosed();
  }

}
