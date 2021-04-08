import {
	Component,
	OnInit,
	ChangeDetectorRef,
	ViewChild,
	ElementRef,
	ChangeDetectionStrategy,
} from '@angular/core';
import { CommonApiService } from 'src/app/services/common-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { AuthenticationService } from '../../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';

import { User } from '../../../models/User';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { ProductAddDialogComponent } from 'src/app/components/products/product-add-dialog/product-add-dialog.component';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ProductEditDialogComponent } from 'src/app/components/products/product-edit-dialog/product-edit-dialog.component';
import { SuccessMessageDialogComponent } from 'src/app/components/success-message-dialog/success-message-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-view-products',
	templateUrl: './view-products.page.html',
	styleUrls: ['./view-products.page.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewProductsPage implements OnInit {
	productinfo: any;

	center_id: any;

	pcount: any;
	pageLength: any;
	isTableHasData = false;

	userdata$: Observable<User>;
	userdata: any;

	@ViewChild('mySearchbar', { static: true }) searchbar: IonSearchbar;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	@ViewChild('epltable', { static: false }) epltable: ElementRef;

	displayedColumns: string[] = [
		'productcode',
		'description',
		'name',
		'rackno',
		'avlstock',
		'mrp',
		'actions',
	];
	dataSource = new MatTableDataSource<Product>();

	tempsearchstring = '';

	constructor(
		private _cdr: ChangeDetectorRef,
		private _commonApiService: CommonApiService,
		private _snackBar: MatSnackBar,
		private _route: ActivatedRoute,
		private _dialog: MatDialog,
		private _router: Router,
		private _authservice: AuthenticationService
	) {
		this.userdata$ = this._authservice.currentUser;
		this.userdata$
			.pipe(filter((data) => data !== null))
			.subscribe((data: any) => {
				this.userdata = data;
				this.center_id = this.userdata.center_id;

				this._cdr.markForCheck();
			});

		this._route.params.subscribe((params) => {
			this.tempsearchstring = '';
			if (this.userdata !== undefined) {
				this.reset();
			}
		});
	}

	ngOnInit() {
		this.dataSource.paginator = this.paginator;
	}

	addProduct() {
		this._router.navigate([`/home/product/add`]);
	}

	editProduct(item) {
		this._router.navigateByUrl(
			`/home/product/edit/${this.center_id}/${item.product_id}`
		);
	}

	ionViewDidEnter() {
		this.searchbar.setFocus();
	}

	openDialog(searchstring): void {
		this._commonApiService
			.getProductInfo({ centerid: this.center_id, searchstring: searchstring })
			.subscribe((data: any) => {
				this.tempsearchstring = searchstring;

				// DnD - code to add a "key/Value" in every object of array
				this.dataSource.data = data.body.map((el) => {
					var o = Object.assign({}, el);
					o.isExpanded = false;
					return o;
				});

				this.dataSource.sort = this.sort;
				this.pageLength = data.body.length;

				if (data.body.length === 0) {
					this.isTableHasData = false;
				} else {
					this.isTableHasData = true;
				}

				if (searchstring.length === 0) {
					this.reset();
					this.isTableHasData = false;
				}

				this._cdr.markForCheck();
			});
	}

	reset() {
		this.searchbar.value = '';

		this.dataSource.data = [];
		this.pageLength = 0;
		this.isTableHasData = false;
	}

	add() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '500px';
		dialogConfig.height = '100%';
		dialogConfig.position = { top: '0', right: '0' };

		const dialogRef = this._dialog.open(
			ProductAddDialogComponent,
			dialogConfig
		);

		dialogRef
			.afterClosed()
			.pipe(
				filter((val) => !!val),
				tap(() => {
					this._cdr.markForCheck();
				})
			)
			.subscribe((data: any) => {
				if (data === 'success') {
					// const dialogConfigSuccess = new MatDialogConfig();
					// dialogConfigSuccess.disableClose = false;
					// dialogConfigSuccess.autoFocus = true;
					// dialogConfigSuccess.width = '25%';
					// dialogConfigSuccess.height = '25%';

					this.openSnackBar('Product added successfully', '');

					// dialogConfigSuccess.data = 'Product added successfully';

					// const dialogRef = this._dialog.open(
					// 	SuccessMessageDialogComponent,
					// 	dialogConfigSuccess
					// );
				}
			});
	}
	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
			duration: 2000,
			panelClass: ['mat-toolbar', 'mat-primary'],
		});
	}
	edit(product: Product) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.autoFocus = true;
		dialogConfig.width = '500px';
		dialogConfig.height = '100%';
		dialogConfig.data = product;
		dialogConfig.position = { top: '0', right: '0' };

		const dialogRef = this._dialog.open(
			ProductEditDialogComponent,
			dialogConfig
		);

		dialogRef
			.afterClosed()
			.pipe(
				filter((val) => !!val),
				tap(() => {
					// do nothing
					this.openDialog(this.tempsearchstring);
					this._cdr.markForCheck();
				})
			)
			.subscribe((data: any) => {
				if (data === 'success') {
					this.openSnackBar('Product edited successfully', '');
				}
			});
	}
}
