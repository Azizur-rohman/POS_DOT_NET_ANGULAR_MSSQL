import { Component } from '@angular/core';

import { navItems } from './_nav';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AsyncService } from 'src/app/shared/services/async.service';
import { interval, tap } from 'rxjs';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {
  public navItems = navItems;

  constructor(
    // public asyncService: AsyncService
    private bb: BnNgIdleService,
  ) {}

}
