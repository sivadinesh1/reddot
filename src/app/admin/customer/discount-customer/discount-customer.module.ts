import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscountCustomerPageRoutingModule } from './discount-customer-routing.module';

import { DiscountCustomerPage } from './discount-customer.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    IonicModule,
    DiscountCustomerPageRoutingModule
  ],
  declarations: [DiscountCustomerPage]
})
export class DiscountCustomerPageModule { }
