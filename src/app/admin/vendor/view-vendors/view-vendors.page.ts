import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar } from '@ionic/angular';

import { MatDialogConfig, MatDialog } from '@angular/material';
import { CurrencyPadComponent } from 'src/app/components/currency-pad/currency-pad.component';
import { filter, tap, catchError } from 'rxjs/operators';
import { Vendor } from 'src/app/models/Vendor';
import { VendorDialogComponent } from 'src/app/components/vendor-dialog/vendor-dialog.component';
import { Observable, throwError } from 'rxjs';
import { LoadingService } from 'src/app/components/loading/loading.service';
import { MessagesService } from '../../../components/messages/messages.service';


@Component({
  selector: 'app-view-vendors',
  templateUrl: './view-vendors.page.html',
  styleUrls: ['./view-vendors.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewVendorsPage implements OnInit {

  center_id: any;
  resultList: any;

  vendors$: Observable<Vendor[]>;


  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;



  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService, private _dialog: MatDialog,
    private _route: ActivatedRoute,
    private loadingService: LoadingService, private _messagesService: MessagesService,
    private _router: Router, ) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;

    this._route.params.subscribe(params => {
      this.reloadVendors();
    });

  }

  ngOnInit() {


  }

  ngAfterViewInit() {

  }

  reloadVendors() {

    const tempVendors$ = this._commonApiService.getAllActiveVendors(this.center_id)
      .pipe(
        catchError(err => {
          console.log('could not load vendors !!');
          const message = "could not load vendors";
          this._messagesService.showErrors(message);
          return throwError(err);
        })
      );

    this.vendors$ = this.loadingService.showLoaderUntilCompleted(tempVendors$);
    this._cdr.markForCheck();
  }

  addVendor() {
    this._router.navigate([`/home/vendor/add`]);
  }

  // editVendor(item) {
  //   this._router.navigate([`/home/vendor/edit`, this.center_id, item.id]);
  // }


  editVendor(vendor: Vendor) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = vendor;


    const dialogRef = this._dialog.open(VendorDialogComponent, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter(val => !!val),
        tap(() => {
          this.reloadVendors();
          this._cdr.markForCheck();
        }
        )
      ).subscribe();


  }


}
