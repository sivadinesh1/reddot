import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent implements OnInit {


  userdata: any;


  constructor(private _authservice: AuthenticationService, private _router: Router) { }

  ngOnInit() {


    this.userdata = this._authservice.currentUserValue;



  }

  goAdmin() {
    this._router.navigate([`/home/admin`]);
  }


  async logout() {
    await this._authservice.logOut();
    this._router.navigateByUrl('');
  }

}
