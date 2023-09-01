import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/category/duplicate-check/`, formValue);
  }

  public getSingleCategory(paramId: any) : Observable<any> {   
    return this.http.get(`api/category/single-entry/` + paramId);
  }

  public getCategoryList() : Observable<any> {   
    return this.http.get(`api/category/view`);
  }

  public addCategory(value: any) {   
    return this.http.post(`api/category/add`, value);
  }

  public deleteCategory(id: string) {   
    return this.http.delete(`api/category/delete/` + id);
  }

  public updateCategory(value: any) {   
    return this.http.post(`api/category/update/`, value);
  }
}

