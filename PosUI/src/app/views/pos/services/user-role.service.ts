import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {
  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/user-role/duplicate-check/`, formValue);
  }

  public getSingleUserRole(paramId: any) : Observable<any> {   
    return this.http.get(`api/user-role/single-entry/` + paramId);
  }

  public getUserRoleList() : Observable<any> {   
    return this.http.get(`api/user-role/view`);
  }

  public addUserRole(value: any) {   
    return this.http.post(`api/user-role/add`, value);
  }

  public deleteUserRole(id: string) {   
    return this.http.delete(`api/user-role/delete/` + id);
  }

  public updateUserRole(value: any) {   
    return this.http.post(`api/user-role/update/`, value);
  }
}

