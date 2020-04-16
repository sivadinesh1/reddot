import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsReceivablePage } from './accounts-receivable.page';

const routes: Routes = [
  {
    path: '',
    component: AccountsReceivablePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsReceivablePageRoutingModule {}
