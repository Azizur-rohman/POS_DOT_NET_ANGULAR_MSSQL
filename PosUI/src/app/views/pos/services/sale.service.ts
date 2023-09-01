import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/sale/duplicate-check/`, formValue);
  }

  public getSingleSale(paramId: any) : Observable<any> {   
    return this.http.get(`api/sale/single-entry/` + paramId);
  }

  public getSaleList() : Observable<any> {   
    return this.http.get(`api/sale/view`);
  }

  public getSaleDetailList(order_no: string) : Observable<any> { 
    
    console.log('order', order_no);
      
    return this.http.get(`api/sale/view-detail/` + order_no);
  }

  public addSale(customerDetail: any, saleDetail: any) {
    var postData = {
      saleForm: customerDetail,
      saleDtlArr: saleDetail,
    }
    return this.http.post(`api/sale/add`, postData);
  }

  public deleteSale(id: string) {   
    return this.http.delete(`api/sale/delete/` + id);
  }
  public deleteSaleDetail(id: string, saleId: any, customerDetail: any) {   
    console.log('customerDetail', customerDetail);
    
    return this.http.post(`api/sale/delete-sale-detail/${id}/${saleId}/`, customerDetail);
  }

  public updateSale(customerDetail: any, saleDetail: any, deleteArr: any) {
    var postData = {
      saleForm: customerDetail,
      saleDtlArr: saleDetail,
      deleteSaleDtlArr: deleteArr,
    }
    return this.http.post(`api/sale/update/`, postData);
  }
}
