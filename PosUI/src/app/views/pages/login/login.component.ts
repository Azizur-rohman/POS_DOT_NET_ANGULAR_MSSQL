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
import { UserRoleService } from 'src/app/views/pos/services/user-role.service';
import { UserActivityService } from 'src/app/views/pages/services/user-activity.service';
import { UserEntryService } from '../../pos/services/user-entry.service';
import { MenuPathService } from '../../pos/services/menu-path.service';
import { MenuService } from '../../pos/services/menu.service';
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
  menuData: any = [];
  menuPathData: any = [];
  displayBranch: string = '';
  displayDesig: string = '';
  displayJoin: any;
  displayConfirm: any;
  empInfo: any;
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
  userData: any;
  userItemArray: any = [];

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
    private userCategoryService: UserCategoryService,
    public UserRoleService: UserRoleService,
    private userActivityService: UserActivityService,
    public userEntryService: UserEntryService,
    public menuPathService: MenuPathService,
    public menuService: MenuService,
  ) {}

  ngOnInit(): void {
    // this.authInfo();
    // this.formInfo();
    // this.uiInfo();
    this.getUserRoleList();
    this.getMenuList();
    this.getMenuPathList();
  }
  getUserRoleList() {
    this.UserRoleService.getUserRoleList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {          
        this.roleData = getData['data'] ;
        }
      });
  };

  getMenuList() {
    this.menuService.getMenuList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {          
        this.menuData = getData['data'] ;
        }
      });
  };

  getMenuPathList() {
    this.menuPathService.getMenuPathList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {          
        this.menuPathData = getData['data'] ;
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
            this.userData = add['data'];
            this.loginUser = add['data'][0];
            localStorage.setItem("isLoggedin", JSON.stringify(this.loginUser));
            localStorage.setItem("hasRole", JSON.stringify(this.roleData));
            localStorage.setItem("menu", JSON.stringify(this.menuData));
            localStorage.setItem("menuPath", JSON.stringify(this.menuPathData));
            this.updateUser();
            this.userActivityService.startLoginTimer();
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

  getUserItemArray()
  {
    for(let i=0; i< this.userData.length ; i++)
        {
            this.userItemArray.push({
              id: this.userData[i].id,
              lastTimeLogout: null,
            })
       }
  }

 async updateUser() {
    await this.getUserItemArray();
    this.userEntryService
     .updateUserLoggedInTime(this.userItemArray[0]).subscribe(
       (add:any) => {
         
       },
       (err) => {
         this.commonService.showErrorMsg(err.message)
       }
     );
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