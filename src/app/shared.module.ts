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
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatSliderModule, MatSelectModule, MatRadioModule, MatSlideToggleModule, MatExpansionModule, MatDatepickerModule, MatCardModule, MatToolbarModule, MatNativeDateModule, MatTooltipModule, MatTableModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatChipsModule, MatButtonToggleModule, MatSidenavModule, MatListModule, MatCheckboxModule, MatAutocompleteModule, MatProgressBarModule, MatBottomSheetModule, MatProgressSpinnerModule, MatDialogModule, MAT_DATE_LOCALE, MatSnackBarModule, MatBadgeModule, MatTabsModule, MatHorizontalStepper, MatStep, MatStepperModule } from '@angular/material';
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
import { VendorDialogComponent } from './components/vendor-dialog/vendor-dialog.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MessagesComponent } from './components/messages/messages.component';
import { InvoiceSuccessComponent } from './components/invoice-success/invoice-success.component';
import { SideMnuComponent } from './components/side-mnu/side-mnu.component';
import { HeaderComponent } from './components/header/header.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { ArrowDivDirective } from './directive/arrow-div.directive';

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
  VendorDialogComponent,
  CurrencyPadComponent,
  InvoiceSuccessComponent,
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
  InvoiceSuccessComponent,

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
    ...matcomponents,

  ],
  exports: [
    ...matcomponents, ...components, IonicModule
  ],
  entryComponents: [
    AddProductComponent, CurrencyPadComponent, ShowVendorsComponent, ShowCustomersComponent,
    ChangeTaxComponent, ChangeMrpComponent, VendorDialogComponent, InvoiceSuccessComponent
  ]
})
export class SharedModule { }
