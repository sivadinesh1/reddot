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
        path: 'enquiry/open-enquiry/:status/:timeline',
        loadChildren: () => import('./enquiry/open-enquiry/open-enquiry.module').then(m => m.OpenEnquiryPageModule)
      },

      {
        path: 'search-purchase',
        loadChildren: () => import('./purchase/search-purchase/search-purchase.module').then(m => m.SearchPurchasePageModule)
      },
      {
        path: 'purchase/:edit/:purchaseid',
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchasePageModule)
      },
      {
        path: 'search-sales',
        loadChildren: () => import('./sales/search-sales/search-sales.module').then(m => m.SearchSalesPageModule)
      },
      {
        path: 'search-return-sales',
        loadChildren: () => import('./sales/return-sale/search-return-sales/search-return-sales.module').then(m => m.SearchReturnSalesPageModule)
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
        path: 'enquiry',
        loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule)
      },
      // {
      //   path: 'purchase/:edit/:purchaseid',
      //   loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchasePageModule)
      // },


      {
        path: 'sales/:mode/:id', pathMatch: 'full',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'admin-dashboard',
        loadChildren: () => import('./dashboard/admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardPageModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./accounts/accounts-payments/accounts-payments.module').then(m => m.AccountsPaymentsPageModule)
      },

      // {
      //   path: 'accounts-payments',
      //   loadChildren: () => import('./accounts/accounts-payments/accounts-payments.module').then(m => m.AccountsPaymentsPageModule)
      // },

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

      // brands
      {
        path: 'view-brands',
        loadChildren: () => import('./admin/brand/view-brands/view-brands.module').then(m => m.ViewBrandsPageModule)
      },


      // customers
      {
        path: 'view-customers',
        loadChildren: () => import('./admin/customer/view-customer/view-customer.module').then(m => m.ViewCustomerPageModule)
      },

      // customers
      {
        path: 'view-discounts',
        loadChildren: () => import('./admin/customer/discounts/view-discounts/view-discounts.module').then(m => m.ViewDiscountsPageModule)
      },
      {
        path: 'ledger-customer/:center_id/:customer_id',
        loadChildren: () => import('./admin/customer/ledger-customer/ledger-customer.module').then(m => m.LedgerCustomerPageModule)
      },
      {
        path: 'financials-customer/:center_id/:customer_id',
        loadChildren: () => import('./admin/customer/financials-customer/financials-customer.module').then(m => m.FinancialsCustomerPageModule)
      },

      // centers
      {
        path: 'center/edit/:center_id',
        loadChildren: () => import('./admin/center/edit-center/edit-center.module').then(m => m.EditCenterPageModule)
      },
      {
        path: 'reports',
        children: [
          {
            path: 'inventory-reports',
            loadChildren: () => import('./reports/inventory-reports/inventory-reports.module').then(m => m.InventoryReportsPageModule)
          },
          {
            path: 'product-summary-reports',
            loadChildren: () => import('./reports/product-summary-reports/product-summary-reports.module').then(m => m.ProductSummaryReportsPageModule)
          },

        ]
      },


    ]
  },

  {
    path: 'enquiry',
    loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryPageModule),
  },

  {
    path: 'view-discounts',
    loadChildren: () => import('./admin/customer/discounts/view-discounts/view-discounts.module').then(m => m.ViewDiscountsPageModule)
  },
  {
    path: 'inventory-reports',
    loadChildren: () => import('./reports/inventory-reports/inventory-reports.module').then(m => m.InventoryReportsPageModule)
  },
  {
    path: 'ledger-customer',
    loadChildren: () => import('./admin/customer/ledger-customer/ledger-customer.module').then(m => m.LedgerCustomerPageModule)
  },
  {
    path: 'financials-customer',
    loadChildren: () => import('./admin/customer/financials-customer/financials-customer.module').then(m => m.FinancialsCustomerPageModule)
  },

  {
    path: 'general-settings',
    loadChildren: () => import('./settings/general-settings/general-settings.module').then(m => m.GeneralSettingsPageModule),
    outlet: 'settings'
  },
  {
    path: 'permissions-settings',
    loadChildren: () => import('./settings/permissions-settings/permissions-settings.module').then(m => m.PermissionsSettingsPageModule),
    outlet: 'settings'
  },
  // {
  //   path: 'product-summary-reports',
  //   loadChildren: () => import('./reports/product-summary-reports/product-summary-reports.module').then( m => m.ProductSummaryReportsPageModule)
  // },


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'top' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


