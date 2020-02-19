import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewVendorsPageRoutingModule } from './view-vendors-routing.module';

import { ViewVendorsPage } from './view-vendors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewVendorsPageRoutingModule
  ],
  declarations: [ViewVendorsPage]
})
export class ViewVendorsPageModule {}
