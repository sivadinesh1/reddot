import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/User';
import { filter, map, defaultIfEmpty } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  userdata: any;
  center_id: any;

  userdata$: Observable<User>;

  @Input() sidenav: MatSidenav;
  public today = Date.now();

  constructor(private _authservice: AuthenticationService, private _modalcontroller: ModalController,
    private _cdr: ChangeDetectorRef,
    private _router: Router) {



    this.userdata$ = this._authservice.currentUser;

    this.userdata$
      .pipe(
        filter((data) => data !== null))
      .subscribe((data: any) => {
        this.userdata = data;
        this._cdr.markForCheck();
      });

  }

  ngOnInit() {

  }





  toggle() {
    this.sidenav.toggle();
    this._cdr.markForCheck();
  }


  goAdmin() {
    this._router.navigate([`/home/admin`]);
  }


  async logout() {
    await this._authservice.logOut();
    this._router.navigateByUrl('');
  }


  viewProduct() {
    this._router.navigate([`/home/view-products`]);
  }

  viewVendor() {
    this._router.navigate([`/home/view-vendors`]);
  }

  viewBrand() {
    this._router.navigate([`/home/view-brands`]);
  }

  viewCustomer() {
    this._router.navigate([`/home/view-customers`]);
  }

  editCenter() {
    this._router.navigate([`/home/center/edit`, this.userdata.center_id]);
  }

  showNewEnquiry() {
    this._router.navigate([`/home/enquiry`]);
  }

  viewDiscounts() {
    this._router.navigate(['/home/view-discounts']);
  }

  async showAddProductComp() {


    const modal = await this._modalcontroller.create({
      component: AddProductComponent,
      componentProps: { center_id: this.userdata.center_id, customer_id: 0, },
      cssClass: 'select-modal'

    });

    modal.onDidDismiss().then((result) => {
      console.log('The result:', result);



      this._cdr.markForCheck();
    });

    await modal.present();

  }

  openBackOrder() {
    this._router.navigateByUrl('/home/enquiry/back-order');
  }

}