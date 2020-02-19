import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVendorPage } from './add-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: AddVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVendorPageRoutingModule {}
