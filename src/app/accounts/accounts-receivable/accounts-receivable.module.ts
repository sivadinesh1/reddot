import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountsReceivablePageRoutingModule } from './accounts-receivable-routing.module';

import { AccountsReceivablePage } from './accounts-receivable.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    IonicModule,
    AccountsReceivablePageRoutingModule
  ],
  declarations: [AccountsReceivablePage]
})
export class AccountsReceivablePageModule { }
