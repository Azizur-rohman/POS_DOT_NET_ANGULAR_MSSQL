import { ChangeDetectorRef, Component } from '@angular/core';

import { navItems } from './_nav';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { interval, Subscription, tap } from 'rxjs';
import { BnNgIdleService } from 'bn-ng-idle';
import { UIInfo } from 'src/app/shared/models/ui-info.model';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {
  public navItems =  navItems;
  public uiInfo? : UIInfo;
  uiInfoSub!     : Subscription;
  constructor(
    // public asyncService: AsyncService
    public commonService: CommonService,
    private bb: BnNgIdleService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void { 
    this.uiInfoSub = this.commonService.uiInfo.subscribe((uiInfo: any) => {
      this.uiInfo = uiInfo;
      this.changeDetectorRef.detectChanges();
    });
  }

}
