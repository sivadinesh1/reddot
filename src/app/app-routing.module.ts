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
        path: 'enquiry/open-enquiry',
        loadChildren: () => import('./enquiry/open-enquiry/open-enquiry.module').then(m => m.OpenEnquiryPageModule)
      },

      {
        path: 'search-purchase',
        loadChildren: () => import('./purchase/search-purchase/search-purchase.module').then(m => m.SearchPurchasePageModule)
      },
      {
        path: 'search-sales',
        loadChildren: () => import('./sales/search-sales/search-sales.module').then(m => m.SearchSalesPageModule)
      },

      {
        path: 'view-products', pathMatch: 'full',
        loadChildren: () => import('./admin/product/view-products/view-products.module').then(m => m.ViewProductsPageModule)
      },


      {
        path: 'view-product/:center_id/:product_id',
        loadChildren: () => import('./admin/product/view-product/view-product.module').then(m => m.ViewProductPageModule)
      },

      {
        path: 'product/add',
        loadChildren: () => import('./admin/product/add-product/add-product.module').then(m => m.AddProductPageModule)
      },


      {
        path: 'enquiry',
        loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule)
      },
      {
        path: 'purchase/:edit/:purchaseid',
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchasePageModule)
      },


      {
        path: 'sales/:mode/:id', pathMatch: 'full',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },


      {
        path: 'enquiry/process-enquiry/:enqid',
        loadChildren: () => import('./enquiry/process-enquiry/process-enquiry.module').then(m => m.ProcessEnquiryPageModule)
      },

      {
        path: 'product/edit/:centerid/:productid',
        loadChildren: () => import('./admin/product/edit-product/edit-product.module').then(m => m.EditProductPageModule)
      },

      // vendors
      {
        path: 'view-vendors',
        loadChildren: () => import('./admin/vendor/view-vendors/view-vendors.module').then(m => m.ViewVendorsPageModule)
      },


      // customers
      {
        path: 'view-customers',
        loadChildren: () => import('./admin/customer/view-customer/view-customer.module').then(m => m.ViewCustomerPageModule)
      },


      {
        path: 'customer/save-discount/:customer_id',
        loadChildren: () => import('./admin/customer/discount-customer/discount-customer.module').then(m => m.DiscountCustomerPageModule)
      },

      // centers
      {
        path: 'center/edit/:center_id',
        loadChildren: () => import('./admin/center/edit-center/edit-center.module').then(m => m.EditCenterPageModule)
      },
      // accounts
      {
        path: 'accounts/accounts-dash',
        loadChildren: () => import('./accounts/accounts-dash/accounts-dash.module').then(m => m.AccountsDashPageModule)
      },
      {
        path: 'accounts/accounts-receivable',
        loadChildren: () => import('./accounts/accounts-receivable/accounts-receivable.module').then(m => m.AccountsReceivablePageModule)
      },


    ]
  },

  {
    path: 'enquiry',
    loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule),
  },
  {
    path: 'discount-customer',
    loadChildren: () => import('./admin/customer/discount-customer/discount-customer.module').then(m => m.DiscountCustomerPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'top' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


