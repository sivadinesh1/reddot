import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { errorApiUrl } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as FileSaver from 'file-saver';

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

  viewProductInfo(center_id: string, product_code: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/view-product-info/${center_id}/${product_code}`);
  }

  viewProductsCount(center_id: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/admin/view-products-count/${center_id}`);
  }

  getProductInfo(center_id: string, searchstr: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/search-product/${center_id}/${searchstr}`);
  }

  getProductInformation(center_id: string, customer_id: string, order_date: string, searchstr: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/search-product/${center_id}/${customer_id}/${order_date}/${searchstr}`);
  }



  getCustomerInfo(center_id: string, searchstr: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/search-customer/${center_id}/${searchstr}`);
  }



  getOpenEnquiries(centerid: number, status: string) {

    return this.httpClient.get(`${this.restApiUrl}/api/enquiry/open-enquiries/${centerid}/${status}`);
  }

  getAllActiveVendors(centerid) {
    return this.httpClient.get(this.restApiUrl + '/api/all-active-vendors/' + centerid);
  }

  getAllActiveCustomers(centerid) {
    return this.httpClient.get(this.restApiUrl + '/api/all-active-customers/' + centerid);
  }



  getEnquiryDetails(enqid: string) {
    return this.httpClient.get(this.restApiUrl + '/api/enquiry/get-enquiry-details/' + enqid);
  }

  savePurchaseOrder(purchaseObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/insert-purchase-details/', purchaseObj, { observe: 'response' });
  }

  saveSaleOrder(saleObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/insert-sale-details/', saleObj, { observe: 'response' });
  }

  saveEnquiry(enqObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/insert-enquiry-details/', enqObj, { observe: 'response' });
  }


  updateEnquiryDetails(enqDetailObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/update-enquiry-details/', enqDetailObj, { observe: 'response' });
  }

  updatePoductIdEnquiryDetails(productid, status, enqdetailid, stockid) {

    let body: HttpParams = new HttpParams();
    body = body.append('productid', productid);
    body = body.append('status', status);
    body = body.append('enqdetailid', enqdetailid);
    body = body.append('stockid', stockid);




    return this.httpClient.post<any>(this.restApiUrl + '/api/enquiry/update-productinfo-enquiry-details', body, { observe: 'response' });
  }


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

  updateVendor(submitForm) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/admin/update-vendor', submitForm, { observe: 'response' });
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

}
