import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditVendorPageRoutingModule } from './edit-vendor-routing.module';

import { EditVendorPage } from './edit-vendor.page';
import { SharedModule } from '../../../shared.module';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    EditVendorPageRoutingModule
  ],
  declarations: [EditVendorPage]
})
export class EditVendorPageModule { }
