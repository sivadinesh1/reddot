import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';


const routes: Routes = [
  {
    path: '',
    component: HomePage, children: [

      {
        path: 'enquiry',
        loadChildren: () => import('../enquiry/enquiry.module').then(m => m.EnquiryPageModule)
      },
      {
        path: 'purchase/:purchaseid',
        loadChildren: () => import('../purchase/purchase.module').then(m => m.PurchasePageModule)
      },
      {
        path: 'search-purchase',
        loadChildren: () => import('../purchase/search-purchase/search-purchase.module').then(m => m.SearchPurchasePageModule)
      },
      {
        path: 'sales/:enqid',
        loadChildren: () => import('../sales/sales.module').then(m => m.SalesPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'enquiry/open-enquiry',
        loadChildren: () => import('../enquiry/open-enquiry/open-enquiry.module').then(m => m.OpenEnquiryPageModule)
      },


      {
        path: 'enquiry/process-enquiry/:enqid',
        loadChildren: () => import('../enquiry/process-enquiry/process-enquiry.module').then(m => m.ProcessEnquiryPageModule)
      },

      {
        path: 'enquiry/back-order',
        loadChildren: () => import('../enquiry/back-order/back-order.module').then(m => m.BackOrderPageModule)
      },

      {
        path: 'view-products',
        loadChildren: () => import('../admin/product/view-products/view-products.module').then(m => m.ViewProductsPageModule)
      },

      {
        path: 'view-product/:center_id/:product_id',
        loadChildren: () => import('../admin/product/view-product/view-product.module').then(m => m.ViewProductPageModule)
      },

      {
        path: 'product/add',
        loadChildren: () => import('../admin/product/add-product/add-product.module').then(m => m.AddProductPageModule)
      },

      {
        path: 'product/edit/:centerid/:productid',
        loadChildren: () => import('../admin/product/edit-product/edit-product.module').then(m => m.EditProductPageModule)
      },

      // vendors
      {
        path: 'view-vendors',
        loadChildren: () => import('../admin/vendor/view-vendors/view-vendors.module').then(m => m.ViewVendorsPageModule)
      },



      {
        path: 'vendor/add',
        loadChildren: () => import('../admin/vendor/add-vendor/add-vendor.module').then(m => m.AddVendorPageModule)
      },

      // customers
      {
        path: 'view-customers',
        loadChildren: () => import('../admin/customer/view-customer/view-customer.module').then(m => m.ViewCustomerPageModule)
      },

      {
        path: 'customer/edit/:center_id/:customer_id',
        loadChildren: () => import('../admin/customer/edit-customer/edit-customer.module').then(m => m.EditCustomerPageModule)
      },

      {
        path: 'customer/add',
        loadChildren: () => import('../admin/customer/add-customer/add-customer.module').then(m => m.AddCustomerPageModule)
      },

      // centers
      {
        path: 'center/edit/:center_id',
        loadChildren: () => import('../admin/center/edit-center/edit-center.module').then(m => m.EditCenterPageModule)
      },
      // accounts
      {
        path: 'accounts/accounts-dash',
        loadChildren: () => import('../accounts/accounts-dash/accounts-dash.module').then(m => m.AccountsDashPageModule)
      },
      {
        path: 'accounts/accounts-receivable',
        loadChildren: () => import('../accounts/accounts-receivable/accounts-receivable.module').then(m => m.AccountsReceivablePageModule)
      },

    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class HomePageRoutingModule { }
