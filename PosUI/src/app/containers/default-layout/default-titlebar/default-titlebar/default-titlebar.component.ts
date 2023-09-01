import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { Subscription } from 'rxjs';
import { UIInfo } from 'src/app/shared/models/ui-info.model';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-default-titlebar',
  templateUrl: './default-titlebar.component.html',
  styleUrls: ['./default-titlebar.component.scss']
})
export class DefaultTitlebarComponent extends HeaderComponent implements OnInit {
  uiInfo?        : UIInfo;
  uiInfoSub!     : Subscription;
  asyncSub!      : Subscription;
  isLoading      : boolean = false;

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
              ) {
    super();
  }

  ngOnInit(): void { 

    this.uiInfoSub = this.commonService.uiInfo.subscribe((uiInfo: any) => {
      this.uiInfo = uiInfo;
      this.changeDetectorRef.detectChanges();
      console.log('this.uiInfo', this.uiInfo);
      
    });
    
    // this.asyncSub = this.asyncService.isLoading.subscribe(loading => {
    //   this.isLoading = loading;
    //   this.changeDetectorRef.detectChanges();
    // });
  }

  logout(){
    localStorage.setItem("isLoggedin", "false");
    this.router.navigate(['login']);
  }

  goBackToPath(){
    if(this.uiInfo && this.uiInfo.goBackPath) {
      this.router.navigate(["../../"]);
      this.changeDetectorRef.detectChanges();
    }
  }

  refreshPathViaHome() {
    this.commonService.refreshViaHome(this.router.url.split(';')[0]);
  }

}
