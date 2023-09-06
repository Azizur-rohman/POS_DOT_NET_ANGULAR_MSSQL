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
  imageSrc       : string = '';
  loginUser: string= '';
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
              ) {
    super();
  }

  ngOnInit(): void {
    this.authInfo();
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

  getUserRoleList() {
    this.userEntryService.getUserList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {          
        let userData = getData['data'] ;
        for(let i=0; i<userData.length ; i++)
        {
          if(userData[i].userId == this.loginUser)
          {
            this.imageSrc = userData[i].image != null ? userData[i].image : user.imgBase64;
          }
        }
        }
      });
  };

  logout(){
    localStorage.setItem("isLoggedin", "false");
    localStorage.setItem("hasRole", "null");
    this.router.navigate(['login']);
  }

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
