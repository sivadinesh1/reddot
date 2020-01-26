import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // { path: '', redirectTo: 'tabs/tab1/search', pathMatch: 'full' },

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'billing/:enquiryid',
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingPageModule)
  },
  {
    path: 'purchase',
    loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchasePageModule)
  },
  {
    path: 'sales',
    loadChildren: () => import('./sales/sales.module').then(m => m.SalesPageModule)
  },
  // {
  //   path: 'search',
  //   loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
