import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountCustomerPage } from './discount-customer.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountCustomerPageRoutingModule {}
