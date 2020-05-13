import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasePage } from './purchase.page';
import { PurchaseDataResolverService } from '../services/purchase-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PurchasePage,
    resolve: { rawpurchasedata: PurchaseDataResolverService }
  },

  {
    path: 'edit-purchase',
    loadChildren: () => import('./edit-purchase/edit-purchase.module').then(m => m.EditPurchasePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchasePageRoutingModule { }
