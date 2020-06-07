import { Component, OnInit, Inject, ViewChild, HostListener } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-success',
  templateUrl: './invoice-success.component.html',
  styleUrls: ['./invoice-success.component.scss'],
})
export class InvoiceSuccessComponent implements OnInit {
  paletteColour: any;
  isPrint = false;

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(private dialogRef: MatDialogRef<InvoiceSuccessComponent>, ) { }

  ngOnInit() { }

  cancel() {
    this.dialogRef.close();
  }

  printActn() {
    this.isPrint = true;
  }


}
