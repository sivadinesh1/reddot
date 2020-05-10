import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { errorApiUrl } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import * as FileSaver from 'file-saver';
import { Purchase } from '../models/Purchase';
import { Sales } from '../models/Sales';
import { Customer } from '../models/Customer';
import { Vendor } from '../models/Vendor';
import { EnquiryDetail } from '../models/EnquiryDetail';
import { Enquiry } from '../models/Enquiry';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  restApiUrl = environment.restApiUrl;
  errorApiUrl = errorApiUrl;

  constructor(private httpClient: HttpClient) { }

  getStates() {
    return this.httpClient.get(this.restApiUrl + '/api/admin/get-states');
  }

  getAllPartsStockData() {
    return this.httpClient.get(this.restApiUrl + '/api/inventory/all');
  }

  viewProductInfo(center_id: string, product_id: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/view-product-info/${center_id}/${product_id}`);
  }

  viewProductsCount(center_id: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/view-products-count/${center_id}`);
  }

  // getProductInfo(center_id: string, searchstr: string) {
  //   return this.httpClient.get(`${this.restApiUrl}/api/search-product/${center_id}/${searchstr}`);
  // }

  getProductInfo(submitForm) {
    return this.httpClient.post(`${this.restApiUrl}/api/search-product`, submitForm, { observe: 'response' });
  }

  getProductInformation(submitForm) {
    return this.httpClient.post(`${this.restApiUrl}/api/search-product-information`, submitForm, { observe: 'response' });
  }



  getCustomerInfo(center_id: string, searchstr: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/search-customer/${center_id}/${searchstr}`);
  }



  getOpenEnquiries(centerid: number, status: string) {

    return this.httpClient.get(`${this.restApiUrl}/api/enquiry/open-enquiries/${centerid}/${status}`);
  }



  getAllActiveVendors(centerid): Observable<Vendor[]> {
    return this.httpClient.get<Vendor[]>(`${this.restApiUrl}/api/all-active-vendors/${centerid}`);


  }

  getAllActiveCustomers(centerid): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(this.restApiUrl + '/api/all-active-customers/' + centerid);
  }



  getEnquiryDetails(enqid: string) {
    return this.httpClient.get(this.restApiUrl + '/api/enquiry/get-enquiry-details/' + enqid);
  }




  saveEnquiry(enqObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/insert-enquiry-details/', enqObj, { observe: 'response' });
  }


  updateEnquiryDetails(enqDetailObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/update-enquiry-details/', enqDetailObj, { observe: 'response' });
  }

  // updatePoductIdEnquiryDetails(productid, status, enqdetailid, stockid) {

  //   let body: HttpParams = new HttpParams();
  //   body = body.append('productid', productid);
  //   body = body.append('status', status);
  //   body = body.append('enqdetailid', enqdetailid);
  //   body = body.append('stockid', stockid);




  //   return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/update-productinfo-enquiry-details', body, { observe: 'response' });
  // }


  // updateGiveqtyEnquiryDetails(giveqty, enqdetailid) {

  //   let body: HttpParams = new HttpParams();
  //   body = body.append('giveqty', giveqty);
  //   body = body.append('enqdetailid', enqdetailid);

  //   return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/update-giveqty-enquiry-details', body, { observe: 'response' });
  // }

  updateStatusEnquiryDetails(status, enqdetailid) {

    let body: HttpParams = new HttpParams();
    body = body.append('status', status);
    body = body.append('enqdetailid', enqdetailid);

    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/update-status-enquiry-details', body, { observe: 'response' });
  }


  draftEnquiry(prodArr) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/draft-enquiry', prodArr, { observe: 'response' });
  }


  moveToSale(prodArr) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/move-to-sale', prodArr, { observe: 'response' });
  }


  getCustomerData(enqid: string) {
    return this.httpClient.get(this.restApiUrl + '/api/enquiry/get-customer-data/' + enqid);
  }




  getEnquiredProductData(center_id, customer_id, enqid, invdt) {
    return this.httpClient.get(`${this.restApiUrl}/api/enquiry/get-enquired-product-data/${center_id}/${customer_id}/${enqid}/${invdt}`);
  }

  getBackOder(center_id) {
    return this.httpClient.get(`${this.restApiUrl}/api/enquiry/back-order/${center_id}`);
  }


  captureError(errorObj) {

    return this.httpClient.post(`${this.errorApiUrl}/api/errors/capture-error`, errorObj);

  }

  // const blob = new Blob([this.lastassessmentdata], {type: 'application/pdf'});

  // FileSaver.saveAs(blob, this.assessmentdata.custuser.firstName + '_export_' + new Date().getTime() + '.pdf');


  print() {

    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.httpClient
      .get(`${this.restApiUrl}/api/sample-pdf`, { headers: headers, responseType: 'blob' as 'json' });

  }

  addProduct(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/add-product', submitForm, { observe: 'response' });
  }

  updateProduct(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/update-product', submitForm, { observe: 'response' });
  }

  //vendor
  getVendorDetails(center_id, vendor_id) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/get-vendor-details/${center_id}/${vendor_id}`);
  }

  // updateVendor(submitForm) {
  //   return this.httpClient.post<any>(this.restApiUrl + '/api/admin/update-vendor', submitForm, { observe: 'response' });
  // }

  updateVendor(id: number, changes: Partial<Vendor>): Observable<any> {
    return this.httpClient.put<any>(`${this.restApiUrl}/api/admin/update-vendor/${id}`, changes);
  }

  addVendor(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/add-vendor', submitForm, { observe: 'response' });
  }

  // customers
  getCustomerDetails(center_id, customer_id) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/get-customer-details/${center_id}/${customer_id}`);
  }

  updateCustomer(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/update-customer', submitForm, { observe: 'response' });
  }

  addCustomer(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/add-customer', submitForm, { observe: 'response' });
  }

  // centers
  getCenterDetails(center_id) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/get-center-details/${center_id}`);
  }

  updateCenter(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/update-center', submitForm, { observe: 'response' });
  }

  updateTax(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/update-taxrate', submitForm, { observe: 'response' });
  }

  // purchase
  // searchPurchases(centerid, vendorid, status, fromdate, todate) {
  //   return this.httpClient.get(`${this.restApiUrl}/api/stock/search-purchase/${centerid}/${vendorid}/${status}/${fromdate}/${todate}`);
  // }

  searchPurchases(centerid, vendorid, status, fromdate, todate): Observable<Purchase[]> {
    return this.httpClient.get<Purchase[]>(`${this.restApiUrl}/api/stock/search-purchase/${centerid}/${vendorid}/${status}/${fromdate}/${todate}`);
  }

  searchSales(centerid, customerid, status, fromdate, todate): Observable<Sales[]> {
    return this.httpClient.get<Sales[]>(`${this.restApiUrl}/api/stock/search-sales/${centerid}/${customerid}/${status}/${fromdate}/${todate}`);
  }

  searchEnquiries(centerid, customerid, status, fromdate, todate): Observable<Enquiry[]> {
    return this.httpClient.get<Enquiry[]>(`${this.restApiUrl}/api/enquiry/search-enquiries/${centerid}/${customerid}/${status}/${fromdate}/${todate}`);
  }



  // searchAllDraftPurchases(centerid): Observable<Purchase[]> {
  //   // return this.httpClient.get(`${this.restApiUrl}/api/stock/search-all-draft-purchase/${centerid}`);
  //   return this.httpClient.get<Purchase[]>(`${this.restApiUrl}/api/stock/search-all-draft-purchase/${centerid}`)
  //     .pipe(
  //       map(res => res["data"])
  //     );
  // }

  searchAllDraftPurchases(centerid): Observable<Purchase[]> {
    return this.httpClient.get<Purchase[]>(`${this.restApiUrl}/api/stock/search-all-draft-purchase/${centerid}`)
      .pipe(shareReplay());

  }


  // Purchase Screen API's

  savePurchaseOrder(purchaseObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/purchase/insert-purchase-details/', purchaseObj, { observe: 'response' });
  }

  purchaseDetails(id) {
    return this.httpClient.get(`${this.restApiUrl}/api/stock/purchase-details/${id}`);
  }

  purchaseMasterData(id) {
    return this.httpClient.get(`${this.restApiUrl}/api/stock/purchase-master/${id}`);
  }


  deletePurchaseDetails(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/stock/delete-purchase-details', submitForm, { observe: 'response' });
  }

  deleteSalesDetails(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/sale/delete-sales-details', submitForm, { observe: 'response' });
  }

  // updatePurchaseMaster(submitForm) {
  //   return this.httpClient.post<any>(this.restApiUrl + '/api/stock/update-purchase-master', submitForm, { observe: 'response' });
  // }

  deletePurchaseData(id) {

    return this.httpClient.delete(`${this.restApiUrl}/api/stock/delete-purchase/${id}`);
  }


  // Sale Screen API's

  saveSaleOrder(saleObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/sale/insert-sale-details/', saleObj, { observe: 'response' });
  }


  salesMasterData(id) {
    return this.httpClient.get(`${this.restApiUrl}/api/stock/sales-master/${id}`);
  }

  saleDetails(id) {
    return this.httpClient.get(`${this.restApiUrl}/api/stock/sale-details/${id}`);
  }

  deleteSaleDetails(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/stock/delete-sale-details', submitForm, { observe: 'response' });
  }

  // updateSaleMaster(submitForm) {
  //   return this.httpClient.post<any>(this.restApiUrl + '/api/stock/update-sale-master', submitForm, { observe: 'response' });
  // }

  // end
  isProdExists(pCode) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/prod-exists/${pCode}`);
  }


  addAccountReceived(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/accounts/add-account-received', submitForm, { observe: 'response' });
  }



  getAccountsReceivable(centerid) {
    return this.httpClient.get(`${this.restApiUrl}/api/accounts/get-accounts-receivable/${centerid}`);
  }

}

