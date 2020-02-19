import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
})
export class AdminMenuComponent implements OnInit {

  @ViewChild(MatMenu, { static: true }) menu: MatMenu;

  constructor(private _router: Router) { }

  ngOnInit() { }


  viewProduct() {
    this._router.navigate([`/home/view-products`]);
  }

  viewVendor() {
    this._router.navigate([`/home/view-vendors`]);
  }

  viewCustomer() {

  }

  viewCenter() {

  }

  viewCompany() {

  }

}
