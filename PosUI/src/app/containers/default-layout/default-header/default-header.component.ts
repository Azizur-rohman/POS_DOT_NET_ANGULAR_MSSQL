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
              public loaderService: LoaderService
              ) {
    super();
  }

  ngOnInit(): void { 
    this.authInfo();
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
    this.imageSrc = localData.image;
  }

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
