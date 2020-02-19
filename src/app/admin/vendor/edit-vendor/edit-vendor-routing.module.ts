import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditVendorPage } from './edit-vendor.page';

const routes: Routes = [
  {
    path: '',
    component: EditVendorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditVendorPageRoutingModule {}
