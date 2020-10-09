import { Component, OnInit, Inject, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonApiService } from 'src/app/services/common-api.service';

@Component({
  selector: 'app-invoice-success',
  templateUrl: './invoice-success.component.html',
  styleUrls: ['./invoice-success.component.scss'],
})
export class InvoiceSuccessComponent implements OnInit {
  paletteColour: any;
  isPrint = true;
  data: any;

  selectedoption = 'Original for Buyer';
  options: string[] = ['Original for Buyer', 'Duplicate For Transporter', 'Triplicate for Assessee', 'Duplicate'];

  constructor(private dialogRef: MatDialogRef<InvoiceSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public invoice_id: any,
    private _commonApiService: CommonApiService) {
    this.data = invoice_id;
  }

  ngOnInit() {
    this.selectedoption = 'Original for Buyer';
  }

  cancel() {
    this.dialogRef.close();
  }




  printActn() {
    this.isPrint = true;
    this._commonApiService.printInvoice(this.invoice_id, this.selectedoption).subscribe((data: any) => {
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

export interface DialogData {
  animal: string;
  name: string;
}