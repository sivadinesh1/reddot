import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
})
export class AdminDashboardPage implements OnInit {

  userid: any;

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.userid = this._route.snapshot.params['userid'];
  }



  goEnquiryScreen() {
    this._router.navigateByUrl(`/enquiry`);
  }



}
