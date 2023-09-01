import { Injectable } from '@angular/core';

interface IValidMessage {
  employeeCode? : IValidMessageType,
  documentDate? : IValidMessageType,
  documentType? : IValidMessageType,
  docType? : IValidMessageType,
  newDesignation? : IValidMessageType,
  newGrade? : IValidMessageType,
  newDepartment? : IValidMessageType,
  newBranch? : IValidMessageType,
  newUnit? : IValidMessageType,
  designationFrom? : IValidMessageType,
  designationTo? : IValidMessageType,
  effectiveDate? : IValidMessageType,
  releaseDate? : IValidMessageType,
  resignDate? : IValidMessageType,
  incrementDueDate? : IValidMessageType,
  reference? : IValidMessageType,
  remark? : IValidMessageType,
  asOnDate? : IValidMessageType
}

interface IValidMessageType {
  required? : string,
  invalid? : string
}

@Injectable({
  providedIn: 'root'
})
export class ValidationMessageService {

  public messages : IValidMessage;

  constructor() {
    this.getValidationMessage();
  }

  getValidationMessage(){
    this.messages = { 
      'employeeCode' : {
        'required' : 'Employee Id is required',
        'invalid'  : 'Employee Id is invalid'
      },
      'documentDate': {
        'required': 'Document date is required'
      },
      'documentType' : {
        'required': 'Document type is required'
      },
      'docType' : {
        'required': 'Document type is required'
      },
      'effectiveDate': {
        'required': 'Effective date is required'
      },
      'releaseDate': {
        'required': 'Release date is required'
      },
      'resignDate': {
        'required': 'Resign date is required'
      },
      'incrementDueDate': {
        'required': 'Increment due date is required'
      },
      'reference': {
        'required': 'Reference is required'
      },
      'newDesignation': {
        'required': 'New Designation is required'
      },
      'newGrade': {
        'required': 'New Division is required'
      },
      'newDepartment': {
        'required': 'New Department is required'
      },
      'newBranch': {
        'required': 'New Branch is required'
      },
      'newUnit': {
        'required': 'New Unit is required'
      },
      'designationFrom': {
        'required': 'Designation is required'
      },
      'designationTo': {
        'required': 'Designation is required'
      },
      'asOnDate': {
        'required': 'As on date is required'
      },
      'remark': {
        'required': 'Remark is required'
      },
    };
  };
}
