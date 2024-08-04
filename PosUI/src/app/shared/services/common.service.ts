import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/views/pos/dialog/confirmation-dialog/confirmation-dialog.component';
import { ErrorMessageDialogComponent } from '../components/error-message-dialog.component';
import { MessageDialogComponent } from '../components/message-dialog.component';
import { ConfirmationDialog } from '../models/confirmation-dialog.model';
import { MessageDialog } from '../models/message-dialog.model';
import { UIInfo } from '../models/ui-info.model';

@Injectable()
export class CommonService {
  private _defaultData: UIInfo = {
    title: '',
    formId: '',
    goBackPath: '/',
    refreshPath: '/'
  };

  public notifyLeaveAprCount: any = 0;
  public notifyLeaveRepCount: any = 0;
  public tadaCount: any = 0;
  public tfReportingCount: any = 0;
  public tfReleaseCount: any = 0;
  public notifyKpiAprCount: any = 0;
  public totalNotification: any = 0;
  public notifyHidden: boolean = true;

  public getSubMenuCode: string = '';
  public isProfile: boolean = false;
  public isAccessHome: boolean = false;
  invokeSubMenu = new EventEmitter();
  private _dataSource$ = new BehaviorSubject<UIInfo>(this._defaultData);
  private _serviceModalData$ = new BehaviorSubject<any>({});

  public onSaveNewEmpCode: string = '';
  public notifySub!: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router
  ) { }

  get uiInfo(): Observable<UIInfo> {
    return this._dataSource$.asObservable();
  }

  get serviceModalData(): Observable<any> {
    return this._dataSource$.asObservable();
  }

  setUiInfo(info: UIInfo): void {
    this._dataSource$.next(info);
  }

  passSubMenuToHome(subMenu: any) {
    this.invokeSubMenu.emit(subMenu);
  }

  setServiceModalData(obj: any): void {
    this._serviceModalData$.next(obj);
  }

  showSuccessMsg(msg: string, duration = 3000): void {
    this.snackBar.open(msg, '', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar-container', 'success'],
    }); 
  }

  showErrorMsg(msg: string, duration = 3000): void {
    this.snackBar.open(msg, '', {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar-container', 'danger'],
    });
  }

  showSessionExpiredMsg(msg: string): void {
    this.snackBar.open(msg, 'okey', {
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['snackbar-container', 'danger'],
    });
  }

  removeSessionExpiredMsg(): void {
    this.snackBar.dismiss();
  }

  showDialog(data: ConfirmationDialog, callback: Function, otherFunction?: Function): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      minWidth: '30%',
      data,
    });
    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        if (callback) {
          callback();
        }
      }
      else {
        if (otherFunction) {
          otherFunction();
        }        
      }
    });
  }

  showMessageDialog(data: MessageDialog, callback: Function): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      disableClose: true,
      minWidth: '550px',
      data,
    });
    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        if (callback) {
          callback();
        }
      }
    });
  }

  showErrorMessageDialog(data: MessageDialog, callback: Function): void {
    const dialogRef = this.dialog.open(ErrorMessageDialogComponent, {
      disableClose: true,
      minWidth: '550px',
      data,
    });
    dialogRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        if (callback) {
          callback();
        }
      }
    });
  }

  public getNotificationData(currentUser: any): Observable<any> {
    return this.http.get<any>(`/get-notification-data/` + currentUser);
  }

  refreshViaHome(path: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([path]); 
    });
  }

  showNotification(loginUser: any) {
    return this.getNotificationData(loginUser).subscribe((data) => {
      this.notifyLeaveAprCount = data['leaveApproverCount'];
      this.notifyLeaveRepCount = data['leaveReplacementCount'];
      this.tadaCount = data['tadaCount'];
      this.tfReportingCount = data['tfReportingCount'];
      this.tfReleaseCount = data['tfReleaseCount'];
      this.totalNotification = data['totalNotification'];
      if (this.totalNotification > 0) { 
        this.notifyHidden = false;
      } else {
        this.notifyHidden = true;
      }
    });
  }

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      form.getError(key).setErrors(null);
    });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  setFirstLetterCapital(fullSentence: any) {
    if (fullSentence != null) {
      let wordSplit = fullSentence.split(" ");
      for (let i = 0; i < wordSplit.length; i++) {
        wordSplit[i] = wordSplit[i][0].toUpperCase() + wordSplit[i].substring(1).toLowerCase();
      }
      return wordSplit.join(" ");
    } else {
      return fullSentence;
    }
  }
}
