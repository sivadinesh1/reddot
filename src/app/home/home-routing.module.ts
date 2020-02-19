import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';


const routes: Routes = [
  {
    path: '',
    component: HomePage, children: [
      {
        path: 'admin',
        loadChildren: () => import('../admin/admin/admin.module').then(m => m.AdminPageModule)
      },
      {
        path: 'enquiry',
        loadChildren: () => import('../enquiry/enquiry.module').then(m => m.EnquiryPageModule)
      },
      {
        path: 'purchase',
        loadChildren: () => import('../purchase/purchase.module').then(m => m.PurchasePageModule)
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
        path: 'product/edit/:center_id/:product_id',
        loadChildren: () => import('../admin/product/edit-product/edit-product.module').then(m => m.EditProductPageModule)
      },

      // vendors
      {
        path: 'view-vendors',
        loadChildren: () => import('../admin/vendor/view-vendors/view-vendors.module').then(m => m.ViewVendorsPageModule)
      },


    ]
  },




];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class HomePageRoutingModule { }
