import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonApiService } from '../../../services/common-api.service';
import { Validators, FormBuilder } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-brand-add-dialog',
  templateUrl: './brand-add-dialog.component.html',
  styleUrls: ['./brand-add-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandAddDialogComponent implements OnInit {

  center_id: any;
  submitForm: any;
  bexists: any;



  constructor(private _cdr: ChangeDetectorRef, private _router: Router,
    private _formBuilder: FormBuilder, private dialogRef: MatDialogRef<BrandAddDialogComponent>,
    private _route: ActivatedRoute, private _authservice: AuthenticationService,
    private _commonApiService: CommonApiService) {
    const currentUser = this._authservice.currentUserValue;
    this.center_id = currentUser.center_id;


    this.submitForm = this._formBuilder.group({
      center_id: [this.center_id],
      name: [null, Validators.required],
    });

  }

  ngOnInit() {

  }


  onSubmit() {

    if (!this.submitForm.valid) {
      return false;
    }

    if (this.bexists) {
      return false;
    }

    this._commonApiService.addBrand(this.submitForm.value).subscribe((data: any) => {

      if (data.body.result === 'success') {
        this.dialogRef.close('success');
      }
    });

  }

  searchBrands() {
    this._router.navigate([`/home/view-brands`]);
  }

  addBrand() {
    this._router.navigate([`/home/brand/add`]);
  }

  reset() {

  }

  close() {
    this.dialogRef.close();
  }


  isBrandExists() {

    if (this.submitForm.value.name.length > 0) {
      this._commonApiService.isBrandExists(this.submitForm.value.name).subscribe((data: any) => {

        if (data.result.length > 0) {
          if (data.result[0].id > 0) {
            this.bexists = true;
          }
        } else {
          this.bexists = false;
        }

        this._cdr.markForCheck();
      });
    }

  }


}
