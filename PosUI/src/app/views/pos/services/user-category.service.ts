import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserCategoryService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/user-category/duplicate-check/`, formValue);
  }

  public getSingleUserCategory(paramId: any) : Observable<any> {   
    return this.http.get(`api/user-category/single-entry/` + paramId);
  }

  public getUserCategoryList() : Observable<any> {   
    return this.http.get(`api/user-category/view`);
  }

  public addUserCategory(value: any) {   
    return this.http.post(`api/user-category/add`, value);
  }

  public deleteUserCategory(id: string) {   
    return this.http.delete(`api/user-category/delete/` + id);
  }

  public updateUserCategory(value: any) {   
    return this.http.post(`api/user-category/update/`, value);
  }

  // public getUserRoleList() : Observable<any> {   
  //   return this.http.get(`api/user/user-role`);
  // }
}
