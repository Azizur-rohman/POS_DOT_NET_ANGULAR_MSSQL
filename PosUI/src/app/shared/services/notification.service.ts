import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private successMessageSubject = new Subject<any>();
  successMessageAction$ = this.successMessageSubject.asObservable();

  private errorMessageSubject = new Subject<any>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  setSuccessMessage(message: any) {
    this.successMessageSubject.next(message);
  }

  setErrorMessage(message: any) {
    this.errorMessageSubject.next(message);
  }

  clearSuccessMessage() {
    this.setSuccessMessage('');
  }

  clearErrorMessage() {
    this.setErrorMessage('');
  }

  clearAllMessages() {
    this.clearSuccessMessage();
    this.clearErrorMessage();
  }
}
