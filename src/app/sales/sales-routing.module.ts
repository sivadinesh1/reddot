import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesPage } from './sales.page';
import { SalesDataResolverService } from '../services/sales-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: SalesPage,
    resolve: { rawsalesdata: SalesDataResolverService }
  },
  {
    path: 'search-sales',
    loadChildren: () => import('./search-sales/search-sales.module').then(m => m.SearchSalesPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesPageRoutingModule { }
