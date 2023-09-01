import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`/api/lfa-due-date/duplicate-check/`, formValue);
  }

  public getSingleLFADueDate(paramId: string) : Observable<any> {   
    return this.http.get(`/api/lfa-due-date/single-data/` + paramId);
  }

  public getLFADueDateList() : Observable<any> {   
    return this.http.get(`/api/lfa-due-date/view-list`);
  }

  public login(value: any) {   
    return this.http.post(`api/user/login`, value);
  }

  public deleteLFADueDate(id: string) {   
    return this.http.delete(`/api/lfa-due-date/delete/` + id);
  }

  public updateLFADueDate(value: any) {   
    return this.http.post(`/api/lfa-due-date/update-by-id/`, value);
  }

  isLoggedin(): boolean{
    return localStorage.getItem("access_token")? true : false;
  }
}
