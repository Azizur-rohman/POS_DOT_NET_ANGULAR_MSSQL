import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OracleDataService {
  
  //httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }

  private content = new BehaviorSubject<string>("Default data.");
  public share = this.content.asObservable();

  paramId          : string;
  item             : string;
  empId            : string;
  branchView       : string;
  showBranch       : boolean;
  invokeNavItem    = new EventEmitter();  
  invokeEmpItem    = new EventEmitter();   
  invokeUserItem   = new EventEmitter(); 
  invokeBranchView = new EventEmitter(); 
  invokeIdToHome   = new EventEmitter(); 
  passIdFromBranch = new EventEmitter(); 
  
  constructor(private http: HttpClient, 
              private router: Router) {
   
  }

  passIdToHomeComp (subEmpId) {
    this.invokeIdToHome.emit(subEmpId);
  }

  passEmpIdFromBranch(subEmpId) {
    this.passIdFromBranch.emit(subEmpId);
  }

  passItemToDiv() {  
    this.invokeNavItem.emit();    
  } 

  passUserToComponent(id) {  
    this.invokeUserItem.emit(id);    
  } 

  passBranchViewToComponent() {  
    this.invokeBranchView.emit();    
  }



 









 

}
