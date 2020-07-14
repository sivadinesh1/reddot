import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NullToQuotePipe } from './util/pipes/null-quote.pipe';
import { NullToZeroPipe } from './util/pipes/null-zero.pipe';
import { NullToDashPipe } from './util/pipes/null-dash.pipe';
import { NullToNaPipe } from './util/pipes/null-na.pipe';
import { CheckBooleanPipe } from './util/pipes/check-boolean.pipe';
import { SupDatePipe } from './util/pipes/sup-date.pipe';
import { CustomPipe } from './util/pipes/keys.pipe';
import { NoNullPipe } from './util/pipes/nonull.pipe';
import { TruncatePipe } from './util/pipes/truncate.pipe';
import { UrlidPipe } from './util/pipes/url-id.pipe';
import { SafePipe } from './util/pipes/safe-html.pipe';
import { EscapeHtmlPipe } from './util/pipes/keep-html.pipe';
import { DayWeekPipe } from './util/pipes/day-week.pipe';
import { ZeroToValPipe } from './util/pipes/zerotoval.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule, MatStep, MatHorizontalStepper } from '@angular/material/stepper';



import { AddProductComponent } from './components/add-product/add-product.component';
import { CurrencyPadComponent } from './components/currency-pad/currency-pad.component';
import { PreventCutCopyPasteDirective } from './directive/prevent-cut-copy-paste.directive';
import { ShowVendorsComponent } from './components/show-vendors/show-vendors.component';
import { ShowCustomersComponent } from './components/show-customers/show-customers.component';
import { AutoFocusDirective } from './util/directives/auto-focus.directive';
import { FocusedDirective } from './util/directives/focused-directive';
import { ShowHidePasswordComponent } from './components/show-hide-password/show-hide-password.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MenuHeaderComponent } from './components/menu-header/menu-header.component';
import { WindowComponent } from './components/window.component';

import { ChangeTaxComponent } from './components/change-tax/change-tax.component';
import { ChangeMrpComponent } from './components/change-mrp/change-mrp.component';
import { PreventDoubleClickDirective } from './util/directives/prevent-double-click.directive';
import { VendorEditDialogComponent } from './components/vendors/vendor-edit-dialog/vendor-edit-dialog.component';
import { VendorAddDialogComponent } from './components/vendors/vendor-add-dialog/vendor-add-dialog.component';

import { CustomerEditDialogComponent } from './components/customers/customer-edit-dialog/customer-edit-dialog.component';
import { CustomerAddDialogComponent } from './components/customers/customer-add-dialog/customer-add-dialog.component';


import { LoadingComponent } from './components/loading/loading.component';
import { MessagesComponent } from './components/messages/messages.component';
import { InvoiceSuccessComponent } from './components/invoice-success/invoice-success.component';
import { SideMnuComponent } from './components/side-mnu/side-mnu.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { ArrowDivDirective } from './directive/arrow-div.directive';
import { RouterModule } from '@angular/router';
import { AddMoreEnquiryComponent } from './components/add-more-enquiry/add-more-enquiry.component';

const components = [

  NullToQuotePipe,
  NullToZeroPipe,
  NullToDashPipe,
  NullToNaPipe,
  CheckBooleanPipe,
  SupDatePipe,
  CustomPipe,
  NoNullPipe,
  TruncatePipe,
  UrlidPipe,
  SafePipe,
  EscapeHtmlPipe,
  DayWeekPipe,
  ZeroToValPipe,

  AddProductComponent,
  VendorEditDialogComponent,
  VendorAddDialogComponent,
  CustomerAddDialogComponent,
  CustomerEditDialogComponent,
  CurrencyPadComponent,
  InvoiceSuccessComponent,
  AddMoreEnquiryComponent,
  ShowVendorsComponent,
  ShowCustomersComponent,
  ChangeTaxComponent,
  ChangeMrpComponent,
  AutoFocusDirective,
  FocusedDirective,
  PreventDoubleClickDirective,

  ShowHidePasswordComponent,
  SideMenuComponent,
  SideMnuComponent,
  MenuHeaderComponent,
  HeaderComponent,
  LeftMenuComponent,


  WindowComponent,
  LoadingComponent,
  MessagesComponent,


];

const matcomponents = [
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSliderModule,
  MatSelectModule,
  MatRadioModule,

  MatSlideToggleModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatCardModule,
  MatNativeDateModule,

  MatToolbarModule,
  MatTooltipModule,
  MatTableModule,
  MatMenuModule,
  MatPaginatorModule,
  MatSortModule,
  MatChipsModule,
  MatButtonToggleModule,
  MatButtonModule,

  MatSidenavModule,
  MatListModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatBottomSheetModule,
  MatDialogModule,
  MatSnackBarModule,
  MatBadgeModule,
  MatTabsModule,
  MatStepperModule,

];


@NgModule({
  declarations: [...components, PreventCutCopyPasteDirective, ArrowDivDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    ...matcomponents,

  ],
  exports: [
    ...matcomponents, ...components, IonicModule
  ],
  entryComponents: [
    AddProductComponent, CurrencyPadComponent, ShowVendorsComponent, ShowCustomersComponent,
    ChangeTaxComponent, ChangeMrpComponent, VendorAddDialogComponent, CustomerAddDialogComponent, CustomerEditDialogComponent, InvoiceSuccessComponent, AddMoreEnquiryComponent
  ]
})
export class SharedModule { }
