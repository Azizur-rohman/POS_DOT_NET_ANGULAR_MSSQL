import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, mapToCanActivate } from '@angular/router';
// import { AuthService } from 'src/app/auth/auth.service';
// import { AsyncService } from 'src/app/shared/services/async.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/views/pages/services/login.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { hasRoleGuard } from 'src/app/views/pages/services/has-role.guard';
import { UserCategoryService } from 'src/app/views/pos/services/user-category.service';
// import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formId = 'lfa-due-date';
  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  paramId: number = 0;
  currentDate: any = new Date();
  loginUser: string= '';
  inputValue: string= '';
  roleData: any = [];
  displayBranch: string = '';
  displayDesig: string = '';
  displayJoin: any;
  displayConfirm: any;
  empInfo: any;
  // authSub: Subscription;
  // duplicateSub: Subscription;
  // addSub: Subscription;
  // paramSub: Subscription;
  // empListSub: Subscription;
  itemArray: any = [];
  statusFlag: any = [
    { code: 'Y', description: 'Yes' },
    { code: 'N', description: 'No' },
  ];
  employeeFilterList: any = [];
  dueFromErr: boolean = false;
  dateToErr: boolean = false;
  dateFromErr: boolean = false;
  dueToErr: boolean = false;

  successMessage$ = this.notificationService.successMessageAction$.pipe(tap((message)=>{
    if(message){
    setTimeout((message: any)=>{
      this.notificationService.clearAllMessages();
    }, 5000)
    }
  }));
  errorMessage$ = this.notificationService.errorMessageAction$.pipe(tap((message)=>{
    if(message){
    setTimeout((message: any)=>{
      this.notificationService.clearAllMessages();
    }, 5000)
    }
  }));

  constructor(
    public fb: FormBuilder,
    // public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    public loginService: LoginService,
    private notificationService : NotificationService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private userCategoryService: UserCategoryService
  ) {}

  ngOnInit(): void {
    // this.authInfo();
    // this.formInfo();
    // this.uiInfo();
    this.getUserRoleList();
  }

  // get f() {
  //   return this.form.controls;
  // }

  // uiInfo() {
  //   this.commonService.setUiInfo({
  //     title: this.paramId ? 'Update LFA Due Date' : 'Add LFA Due Date',
  //     editPath: '/leave-feature/lfa-due-date/view',
  //     formId: this.formId,
  //   });
  // }

  // authInfo() {
  //   this.authSub = this.authService.authInfo.subscribe((data) => {
  //     this.loginUser = data['usercode'];
  //   });
  // }

  // formInfo() {
  //   this.form = this.fb.group({
  //     id: [0],
  //     name: [''],
  //     password: [''],
  //   });
  // }

  // onSaveConfirmation = (): void => {
  //   if (this.form.valid) {
  //       this.commonService.showDialog(
  //         {
  //           title: this.paramId
  //             ? 'Confirmation - Update Record'
  //             : 'Confirmation - Save Record',
  //           content: this.paramId
  //             ? 'Do you want to update record?'
  //             : 'Do you want to save record?',
  //         },
  //         () => this.addLfaDueDate()
  //       );
  //   } else {
  //     this.commonService.showErrorMsg('Please fill up with valid data!!!');
  //   }
  // };
  getUserRoleList() {
    this.userCategoryService.getUserRoleList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {          
        this.roleData = getData['data'] ;
        }
      });
  };

  checkLogin() {
    if(this.userForm.valid){
    this.loginService
      .login(this.userForm.value).subscribe(
        (add: any) => {
          if (add['isExecuted']) 
          {
            this.loginUser = add['data'][0];
            localStorage.setItem("isLoggedin", JSON.stringify(this.loginUser));
            localStorage.setItem("hasRole", JSON.stringify(this.roleData));
            this.commonService.removeSessionExpiredMsg();
            this.router.navigateByUrl('/dashboard');
          } 
          else 
          {
            this.notificationService.setErrorMessage('Wrong username or password');
            localStorage.setItem("isLoggedin", "false");
            localStorage.setItem("hasRole", "null");
          }
        },
        (err) => {
          this.notificationService.setErrorMessage(JSON.stringify(err.name));
        }
      );
    }else{
      this.notificationService.setErrorMessage('Please fill all the fields');
    }
  };

  

  ngOnDestroy() {
    // if (this.authSub) {
    //   this.authSub.unsubscribe();
    // }
    // if (this.duplicateSub) {
    //   this.duplicateSub.unsubscribe();
    // }
    // if (this.empListSub) {
    //   this.empListSub.unsubscribe();
    // }
    // this.asyncService.finish();
  }
}