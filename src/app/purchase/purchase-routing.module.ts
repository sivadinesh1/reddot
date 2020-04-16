import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchasePage } from './purchase.page';
import { ApiDataResolverService } from '../services/api-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PurchasePage,
    resolve: { rawpurchasedata: ApiDataResolverService }
  },
  {
    path: 'search-purchase',
    loadChildren: () => import('./search-purchase/search-purchase.module').then(m => m.SearchPurchasePageModule)
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
