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
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';



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
  CurrencyPadComponent,
  ShowVendorsComponent,
  ShowCustomersComponent,
  AutoFocusDirective,
  FocusedDirective,

  ShowHidePasswordComponent,
  SideMenuComponent,
  MenuHeaderComponent,
  AdminMenuComponent,

  WindowComponent,


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
  declarations: [...components, PreventCutCopyPasteDirective],
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
    AddProductComponent, CurrencyPadComponent, ShowVendorsComponent, ShowCustomersComponent
  ]
})
export class SharedModule { }
