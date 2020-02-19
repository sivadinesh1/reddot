import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // { path: '', redirectTo: 'tabs/tab1/search', pathMatch: 'full' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  // },

  {
    path: 'billing/:enquiryid',
    loadChildren: () => import('./billing/billing.module').then(m => m.BillingPageModule)
  },
  // {
  //   path: 'purchase',
  //   loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchasePageModule)
  // },
  // {
  //   path: 'sales/:enqid',
  //   loadChildren: () => import('./sales/sales.module').then(m => m.SalesPageModule)
  // },

  // {
  //   path: 'enquiry',
  //   loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule)
  // },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
  // },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'view-product',
    loadChildren: () => import('./admin/product/view-product/view-product.module').then(m => m.ViewProductPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./admin/product/add-product/add-product.module').then(m => m.AddProductPageModule)
  },
  {
    path: 'edit-product',
    loadChildren: () => import('./admin/product/edit-product/edit-product.module').then(m => m.EditProductPageModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin/admin.module').then(m => m.AdminPageModule)
  },
  {
    path: 'view-products',
    loadChildren: () => import('./admin/product/view-products/view-products.module').then(m => m.ViewProductsPageModule)
  },
  {
    path: 'add-customer',
    loadChildren: () => import('./admin/customer/add-customer/add-customer.module').then( m => m.AddCustomerPageModule)
  },
  {
    path: 'edit-customer',
    loadChildren: () => import('./admin/customer/edit-customer/edit-customer.module').then( m => m.EditCustomerPageModule)
  },
  {
    path: 'view-customer',
    loadChildren: () => import('./admin/customer/view-customer/view-customer.module').then( m => m.ViewCustomerPageModule)
  },
  {
    path: 'edit-center',
    loadChildren: () => import('./admin/center/edit-center/edit-center.module').then( m => m.EditCenterPageModule)
  },
  // {
  //   path: 'view-vendors',
  //   loadChildren: () => import('./admin/vendor/view-vendors/view-vendors.module').then( m => m.ViewVendorsPageModule)
  // },
  // {
  //   path: 'edit-vendor',
  //   loadChildren: () => import('./admin/vendor/edit-vendor/edit-vendor.module').then( m => m.EditVendorPageModule)
  // },
  // {
  //   path: 'add-vendor',
  //   loadChildren: () => import('./admin/vendor/add-vendor/add-vendor.module').then( m => m.AddVendorPageModule)
  // },



  // {
  //   path: 'search',
  //   loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  // }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


