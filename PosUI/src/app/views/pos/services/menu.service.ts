import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/menu/duplicate-check/`, formValue);
  }

  public getSingleMenu(paramId: any) : Observable<any> {   
    return this.http.get(`api/menu/single-entry/` + paramId);
  }

  public getMenuList() : Observable<any> {   
    return this.http.get(`api/menu/view`);
  }

  public addMenu(value: any) {   
    return this.http.post(`api/menu/add`, value);
  }

  public deleteMenu(id: string) {   
    return this.http.delete(`api/menu/delete/` + id);
  }

  public updateMenu(value: any) {   
    return this.http.post(`api/menu/update/`, value);
  }
}

