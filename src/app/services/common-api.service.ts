import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {
  restApiUrl = environment.restApiUrl;
  constructor(private httpClient: HttpClient) { }

  getAllPartsStockData() {
    return this.httpClient.get(this.restApiUrl + '/api/inventory/all');
  }

  getProductInfo(center_id: string, searchstr: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/search-product/${center_id}/${searchstr}`);
  }

  getCustomerInfo(center_id: string, searchstr: string) {
    return this.httpClient.get(`${this.restApiUrl}/api/search-customer/${center_id}/${searchstr}`);
  }



  getAllActiveEnquiries() {
    return this.httpClient.get(this.restApiUrl + '/api/all-active-enquiries');
  }

  getAllActiveVendors(centerid) {
    return this.httpClient.get(this.restApiUrl + '/api/all-active-vendors/' + centerid);
  }

  getAllActiveCustomers(centerid) {
    return this.httpClient.get(this.restApiUrl + '/api/all-active-customers/' + centerid);
  }



  getDetailsByEnquiryId(enquiryid: string) {
    return this.httpClient.get(this.restApiUrl + '/api/get-enquiry/' + enquiryid);
  }

  savePurchaseOrder(purchaseObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/insert-purchase-details/', purchaseObj, { observe: 'response' });
  }

  saveSaleOrder(saleObj) {
    return this.httpClient.post<any>(this.restApiUrl + '/api/insert-sale-details/', saleObj, { observe: 'response' });
  }




}
