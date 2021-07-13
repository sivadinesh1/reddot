import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonApiService } from 'src/app/services/common-api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { patternValidator } from 'src/app/util/validators/pattern-validator';
import { HSNCODE_REGEX, DISC_REGEX } from 'src/app/util/helper/patterns';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/models/Product';

@Component({
	selector: 'app-product-correction-dialog',
	templateUrl: './product-correction-dialog.component.html',
	styleUrls: ['./product-correction-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCorrectionDialogComponent implements OnInit {
	isLinear = true;
	center_id: any;
	pexists = false;
	temppcode: any;

	brands$: Observable<any>;

	data: Product;

	submitForm: FormGroup;

	productinfo: any;

	product_id: any;

	loading = false;
	currentStep: any;

	stocklist: any;

	reasons = [
		{ key: 'Missing', viewValue: 'Missing' },
		{ key: 'Others', viewValue: 'Others' },
	];

	constructor(
		private _formBuilder: FormBuilder,
		private _router: Router,
		private _route: ActivatedRoute,
		private _cdr: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA) product: Product,
		private _commonApiService: CommonApiService,
		private dialogRef: MatDialogRef<ProductCorrectionDialogComponent>,
		private _authservice: AuthenticationService,
	) {
		// checkda
		const currentUser = this._authservice.currentUserValue;
		this.center_id = currentUser.center_id;
		this.currentStep = 0;
		this.data = product;
	}

	ngOnInit() {
		this.dialogRef.keydownEvents().subscribe((event) => {
			if (event.key === 'Escape') {
				this.close();
			}
		});

		this.dialogRef.backdropClick().subscribe((event) => {
			this.close();
		});

		this._commonApiService.getProductStockWithAllMRP(this.data.product_id).subscribe((data: any) => {
			this.stocklist = data.result;

			this._cdr.markForCheck();
		});
	}

	delete(item) {
		this._commonApiService.deleteProductFromStock(item.product_id, item.mrp).subscribe((data: any) => {
			this.dialogRef.close('success');
		});
	}

	submit() {}

	addProduct() {
		this._router.navigate([`/home/product/add`]);
	}

	searchProducts() {
		this._router.navigate([`/home/view-products`]);
	}

	close() {
		this.dialogRef.close();
	}
}
