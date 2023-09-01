import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/Product/duplicate-check/`, formValue);
  }

  public getSingleProduct(paramId: any) : Observable<any> {   
    return this.http.get(`api/Product/single-entry/` + paramId);
  }

  public getProductList() : Observable<any> {   
    return this.http.get(`api/Product/view`);
  }

  public addProduct(value: any) {   
    return this.http.post(`api/Product/add`, value);
  }

  public deleteProduct(id: string) {   
    return this.http.delete(`api/Product/delete/` + id);
  }

  public updateProduct(value: any) {   
    return this.http.post(`api/Product/update/`, value);
  }
}
