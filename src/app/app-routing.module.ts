import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'billing/:enquiryid',
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingPageModule)
  },

  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },


  {
    path: 'home',
    // loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    component: HomePage,
    children: [

      {
        path: 'enquiry',
        loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule)
      },
      {
        path: 'purchase/:edit/:purchaseid',
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchasePageModule)
      },
      {
        path: 'search-purchase',
        loadChildren: () => import('./purchase/search-purchase/search-purchase.module').then(m => m.SearchPurchasePageModule)
      },
    ]
  },

  {
    path: 'enquiry',
    loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule),
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


