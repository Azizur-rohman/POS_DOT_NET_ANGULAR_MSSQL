import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {


  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/stock-management/duplicate-check/`, formValue);
  }

  public getSingleStockManagement(paramId: any) : Observable<any> {   
    return this.http.get(`api/stock-management/single-entry/` + paramId);
  }

  public getStockManagementList() : Observable<any> {   
    return this.http.get(`api/stock-management/view`);
  }

  public addStockManagement(value: any) {   
    return this.http.post(`api/stock-management/add`, value);
  }

  public deleteStockManagement(id: string) {   
    return this.http.delete(`api/stock-management/delete/` + id);
  }

  public updateStockManagement(value: any) {   
    return this.http.post(`api/stock-management/update/`, value);
  }
}

