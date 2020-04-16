import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountsDashPageRoutingModule } from './accounts-dash-routing.module';

import { AccountsDashPage } from './accounts-dash.page';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    AccountsDashPageRoutingModule
  ],
  declarations: [AccountsDashPage]
})
export class AccountsDashPageModule { }
