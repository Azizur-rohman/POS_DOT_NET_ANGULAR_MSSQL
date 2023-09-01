import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { NotificationService } from './shared/services/notification.service';
import { AsyncService } from './shared/services/async.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { CommonService } from './shared/services/common.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'POS';
  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    public commonService: CommonService,
    private bnIdle: BnNgIdleService
    
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };

  }

  ngOnInit(): void {

    this.bnIdle.startWatching(36000).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          this.commonService.showSessionExpiredMsg('Session Expired')
          localStorage.setItem("isLoggedin", "false");
          this.router.navigateByUrl('login');
          this.bnIdle.stopTimer();
        }
      });
    this.router.events.subscribe((evt: any) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
