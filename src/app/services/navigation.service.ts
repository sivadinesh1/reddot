import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  roletype: any;

  constructor(private _router: Router, private _authservice: AuthenticationService) {

  }





  showDashboard() {

  }

}
