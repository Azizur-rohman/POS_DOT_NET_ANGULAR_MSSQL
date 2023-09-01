import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserEntryService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/user/duplicate-check/`, formValue);
  }

  public getSingleUser(paramId: any) : Observable<any> {   
    return this.http.get(`api/user/single-entry/` + paramId);
  }

  public getUserList() : Observable<any> {   
    return this.http.get(`api/user/view`);
  }

  public addUser(value: any) {   
    return this.http.post(`api/user/add`, value);
  }

  public deleteUser(id: string) {   
    return this.http.delete(`api/user/delete/` + id);
  }

  public updateUser(value: any) {   
    return this.http.post(`api/user/update/`, value);
  }
}


