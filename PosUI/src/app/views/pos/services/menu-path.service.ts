import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuPathService {

  constructor(
    private http: HttpClient
  ) { }

  public duplicateCheck(formValue: any) : Observable<any> { 
    return this.http.post(`api/menu-path/duplicate-check/`, formValue);
  }

  public getSingleMenuPath(paramId: any) : Observable<any> {   
    return this.http.get(`api/menu-path/single-entry/` + paramId);
  }

  public getMenuPathList() : Observable<any> {   
    return this.http.get(`api/menu-path/view`);
  }

  public addMenuPath(value: any) {   
    return this.http.post(`api/menu-path/add`, value);
  }

  public deleteMenuPath(id: string) {   
    return this.http.delete(`api/menu-path/delete/` + id);
  }

  public updateMenuPath(value: any) {   
    return this.http.post(`api/menu-path/update/`, value);
  }
}

