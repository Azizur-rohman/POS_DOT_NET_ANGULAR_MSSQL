import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListOfValuesService {

  constructor(private http: HttpClient
  ) { }

  public getDocTypeList() {
    return this.http.get(`/api/lov-list/document-type`);
  };

  public getPayCycleList() {
    return this.http.get(`/api/lov-list/pay-cycle`);
  };

  public getActivePayCycleList() {
    return this.http.get(`/api/lov-list/pay-cycle/active`);
  };

  public getPayCycleInfo() {
    return this.http.get(`/api/lov-list/single-pay-cycle`);
  };

  public getEarnDeductCodeList() {
    return this.http.get(`/api/lov-list/earn-deduct-code`);
  };

  public getCodeDescription(code) {
    return this.http.get(`/api/lov-list/code-desc/` + code);
  };

  public getEmployeeLovList() {
    return this.http.get(`/api/lov-list/employee-list`);
  };

  public getActiveEmployeeLovList(category?) {
    return this.http.get(`/api/lov-list/active-employee-list/` + category);
  };

  public getBranchById(branch_code) {
    return this.http.get(`/api/lov-list/branchBId/` + branch_code);
  };

  public getBranchLovList() {
    return this.http.get(`/api/lov-list/branch`);
  };

  public getBranchToLovList() {
    return this.http.get(`/api/lov-list/branch-code-to`);
  };

  public getPostingDivisionList() {
    return this.http.get(`/api/lov-list/post-div`);
  };

  public getGradeLovList() {
    return this.http.get(`/api/lov-list/grade`);
  };

  public getDepartmentLovList() {
    return this.http.get(`/api/lov-list/department`);
  };

  public getCurStatusLovList() {
    return this.http.get(`/empstatus/list`);
  };

  public getEmployeeTypeLovList() {
    return this.http.get(`/api/lov-list/emp-type`);
  };

  public getCountryLovList() {
    return this.http.get(`/api/lov-list/country`);
  };

  public getNationalityLovList() {
    return this.http.get(`/api/lov-list/nationality`);
  };

  public getSexLovList() {
    return this.http.get(`/api/lov-list/sex`);
  };

  public getReligionLovList() {
    return this.http.get(`/api/lov-list/religion`);
  };

  public getMaritalStatusLovList() {
    return this.http.get(`/api/lov-list/marital-status`);
  };

  public getBloodGropuLovList() {
    return this.http.get(`/api/lov-list/blood-group`);
  };

  public getExamNameLovList() {
    return this.http.get(`/api/lov-list/exam-name`);
  };

  public getDesignationList() {
    return this.http.get(`/api/lov-list/designation`);
  };

  public getEmpCategoryLovList() {
    return this.http.get(`/api/lov-list/emp-category`);
  };

  public
  getDistrictLovList() {
    return this.http.get(`/api/lov-list/district`);
  };

  public getUpazillaByDist(distCode) {
    return this.http.get(`/api/lov-list/upazilla-by-dist/`+ distCode);
  };

  public getPostOfficeByDist(distCode) {
    return this.http.get(`/api/lov-list/post-office-by-dist/`+ distCode);
  };

  public getLeaveCodeLovList() {
    return this.http.get(`/api/lov-list/leave-code`);
  };

  public getOtherDesignationLovList() {
    return this.http.get(`/api/lov-list/other-designation`);
  };

  public getCompanyLovList() {
    return this.http.get(`/api/lov-list/company`);
  };

  public getEducationLevelList() {
    return this.http.get(`/api/lov-list/education-level`);
  };

  public getDesignationDescList() {
    return this.http.get(`/api/lov-list/designation-desc`);
  };

  public getEducationBoardLovList() {
    return this.http.get(`/api/lov-list/education-board`);
  };

  public getEducationResultLovList() {
    return this.http.get(`/api/lov-list/education-result`);
  };

  public getSubjectLovList() {
    return this.http.get(`/api/lov-list/education-subject`);
  };

  public getInstituteLovList() {
    return this.http.get(`/api/lov-list/education-institute`);
  };


  public getExamNameBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/exam-name/search/` + searchData);
  };

  public getEducationBoardBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/education-board/search/` + searchData);
  };

  public getSubjectBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/subject/search/` + searchData);
  };

  public getInstituteBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/institute/search/` + searchData);
  };

  public getOtherDesignationBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/others-designation/search/` + searchData);
  };

  public getCompanyBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/company/search/` + searchData);
  };

  public getOthersDepartmentBySearch(data?) : Observable<any> {
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/others-department/search/` + searchData);
  };


  public getLeaveTypeLovList() {
    return this.http.get(`/api/lov-list/leave-type`);
  };

  public  getEmpBySearch(data? : any) : Observable<any> {
    let searchData : any;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/emp-list/search/` + searchData);
  };

  public  getContractEmpBySearch(data? : any) : Observable<any> {
    let searchData : any;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/contract-emp-list/search/` + searchData);
  };

  public  getEmpBySearchStatus(status: string, data? : any) : Observable<any> {
    let searchData : any;
    let statusData : string;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }

    if (status) {
      statusData = status;
    } else {
      statusData = 'Y';
    }

    return this.http.get(`/api/lov-list/emp-list/status-search/` + statusData +'/'+ searchData);
  };

  public getEmpInfo(id) : Observable<any> {
    return this.http.get(`/api/lov-list/empinfo/` + id);
  }

  public getEmpInfoByDivision(id) : Observable<any> {
    return this.http.get(`/api/lov-list/emp-list/own-division/` + id);
  }

  public getRelationLovList() {
    return this.http.get(`/api/lov-list/relation`);
  };

  public getAdvancedCodeList() : Observable<any> {
    return this.http.get(`/api/lov-list/advanced-code`);
  }

  public getLocationList() : Observable<any> {
    return this.http.get(`/api/lov-list/location-code`);
  }

  public getAsbCodeList() : Observable<any> {
    return this.http.get(`/api/lov-list/asb-code`);
  }

  public getLeaveRuleCodeList() : Observable<any> {
    return this.http.get(`/api/lov-list/leave-rule-code`);
  }

  public getBankNameList() : Observable<any> {
    return this.http.get(`/api/lov-list/bank-name-list`);
  }

  public getCourseDesc() : Observable<any> {
    return this.http.get(`/api/lov-list/course_desc_list`);
  }

  public getAccountTypeList(bankType) : Observable<any> {
    return this.http.get(`/api/lov-list/account-type-list/`+ bankType);
  }

  public getCodeDescByHde(code) {
    return this.http.get(`/api/lov-list/code-hed-desc/` + code);
  };

  public getEarnDedCode(head) {
    return this.http.get(`/api/lov-list/earndd-code/` + head);
  };

  public getBranchWiseSubBranch(branch_code) {
    return this.http.get(`/api/lov-list/sub-branch-list/` + branch_code);
  };

  public getAllSubBranchList() {
    return this.http.get(`/api/lov-list/all-sub-branch-list`);
  };

  public getKPIBehaviorHeaderList() {
    return this.http.get(`/api/lov-list/kpi_behavior_header`);
  };

  public getBranchListBySearch(data?) : Observable<any> {
    //console.log('data ', data);
    let searchData;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/branch/search/` + searchData);
  };

  public  getOnProbationEmpBySearch(data? : any) : Observable<any> {
    let searchData : any;
    if (data) {
      searchData = data;
    } else {
      searchData = 'blankfield';
    }
    return this.http.get(`/api/lov-list/probation-emp-list/search/` + searchData);
  };

  public getFunDesgHeadList() {
    return this.http.get(`/api/lov-list/fun-desg/head`);
  };

  public getDesignationNameByCode(desigCode) {
    return this.http.get(`/api/ConDesignations/get/desig-code/`+desigCode);
  };

  public getFuntionalDesigList() {
    return this.http.get(`/api/lov-list/fun-desg/list`);
  };

  public getEmployeeListOfBranch(branchCode: string) {
    return this.http.get(`/api/lov-list/emp-list-of-branch/list/${branchCode}`);
  };

  public getDefaultBranchCode() {
    return this.http.get(`/api/lov-list/default-branch-code`);
  };

  public getDefaultDivisionCode() {
    return this.http.get(`/api/lov-list/default-division-code`);
  };

  public getDefaultDeptCode() {
    return this.http.get(`/api/lov-list/default-dept-code`);
  };

  public getBranchInfoByCode(branchCode: string) {
    return this.http.get(`/api/lov-list/branch-info-by-code/${branchCode}`);
  };

  public getCompanyParameter() {
    return this.http.get(`/api/lov-list/company-parameter`);
  };

}
