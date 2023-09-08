import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Subscription, tap } from 'rxjs';
import { UIInfo } from 'src/app/shared/models/ui-info.model';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserEntryService } from 'src/app/views/pos/services/user-entry.service';
import { UserActivityService } from 'src/app/views/pages/services/user-activity.service';
import * as moment from 'moment';
const user = require('src/assets/images/empty-user.js');

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit{
  
  uiInfo?        : UIInfo;
  uiInfoSub!     : Subscription;
  asyncSub!      : Subscription;
  isLoading      : boolean = false;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  imageSrc       : string = '';
  loginUser: string= '';
  userData: any = [];
  userItemArray: any = [];
  elapsedTime: any;
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
  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
              private classToggler: ClassToggleService,
              private router: Router,
              public commonService: CommonService,
              private changeDetectorRef: ChangeDetectorRef,
              // private asyncService: AsyncService,
              private notificationService: NotificationService,
              public loaderService: LoaderService,
              public userEntryService: UserEntryService,
              private userActivityService: UserActivityService
              ) {
    super();
  }

  ngOnInit(): void {
    this.authInfo();
    this.loginTimeCount();
    this.getUserRoleList();
    this.uiInfoSub = this.commonService.uiInfo.subscribe((uiInfo: any) => {
      this.uiInfo = uiInfo;
      this.changeDetectorRef.detectChanges();
      
    });
    
    // this.asyncSub = this.asyncService.isLoading.subscribe(loading => {
    //   this.isLoading = loading;
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.userId;
  }

  loginTimeCount()
  {
    this.elapsedTime = this.userActivityService.getElapsedLoginTime();
    this.getUserItemArray()
  }

  getUserRoleList() {
    this.userEntryService.getUserList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {          
        this.userData = getData['data'] ;
        for(let i=0; i< this.userData.length ; i++)
        {
          if( this.userData[i].userId == this.loginUser)
          {
            this.imageSrc =  this.userData[i].image != null ?  this.userData[i].image : user.imgBase64;
          }
        }
        }
      });
  };

  getUserItemArray()
  {
    for(let i=0; i< this.userData.length ; i++)
        {
          if( this.userData[i].userId == this.loginUser)
          {
            this.userItemArray.push({
              id: this.userData[i].id,
              lastTimeLogout: this.currentDate,
              totalLoggedInTime: this.userData[i].total_looged_in_time + Math.floor(this.elapsedTime)
            })
          }
       }
  }

 async logout(){
    await this.loginTimeCount();
    localStorage.setItem("isLoggedin", "false");
    localStorage.setItem("hasRole", "null");
    this.userActivityService.logout();
    this.updateUser();
    this.router.navigate(['login']);
  }

  updateUser() {
    this.userEntryService
     .updateUserLoggedInTime(this.userItemArray[0]).subscribe(
       (add:any) => {
         
       },
       (err) => {
         this.commonService.showErrorMsg(err.message)
       }
     );
 };

  goBackToPath(){
    if(this.uiInfo && this.uiInfo.goBackPath) {
      this.router.navigate([this.uiInfo.goBackPath]);
      this.changeDetectorRef.detectChanges();
    }
  }

  refreshPathViaHome() {
    this.commonService.refreshViaHome(this.router.url.split(';')[0]);
  }

}
