import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonApiService } from 'src/app/services/common-api.service';
import { IonSearchbar } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { Customer } from 'src/app/models/Customer';
import { MessagesService } from 'src/app/components/messages/messages.service';
import { catchError, filter } from 'rxjs/operators';
import { LoadingService } from 'src/app/components/loading/loading.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.page.html',
  styleUrls: ['./view-customer.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCustomerPage implements OnInit {

  center_id: any;
  resultList: any;


  customer$: Observable<Customer[]>;
  userdata$: Observable<User>;
  userdata: any;

  ready = 0;

  @ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;



  constructor(private _authservice: AuthenticationService, private _cdr: ChangeDetectorRef,
    private _commonApiService: CommonApiService, private _route: ActivatedRoute,
    private _messagesService: MessagesService, private loadingService: LoadingService,
    private _router: Router, ) {

    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.center_id = data.center_id;
        this.ready = 1;
        this.reloadCustomers();
        this._cdr.markForCheck();
      });

    this._route.params.subscribe(params => {


      this.init();

    });


  }

  init() {
    if (this.ready === 1) this.reloadCustomers();
  }


  reloadCustomers() {

    const tempVendors$ = this._commonApiService.getAllActiveCustomers(this.center_id)
      .pipe(
        catchError(err => {
          console.log('could not load customers !!');
          const message = "could not load vendors";
          this._messagesService.showErrors(message);
          return throwError(err);
        })
      );

    this.customer$ = this.loadingService.showLoaderUntilCompleted(tempVendors$);
    this._cdr.markForCheck();
  }

  ngOnInit() {

    // this._commonApiService.getAllActiveCustomers(this.center_id).subscribe((data: any) => {
    //   this.resultList = data;
    //   this._cdr.markForCheck();
    // });
  }

  addCustomer() {
    this._router.navigate([`/home/customer/add`]);
  }

  editCustomer(item) {
    this._router.navigate([`/home/customer/edit`, this.center_id, item.id]);
  }

  setupDiscount(item) {
    this._router.navigate([`/home/customer/save-discount/${item.id}`]);
  }

}

