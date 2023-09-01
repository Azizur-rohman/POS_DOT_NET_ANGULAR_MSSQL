import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { environment } from "../environments/environment";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from './shared/material.module';
import {DatePipe} from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

import { BnNgIdleService } from 'bn-ng-idle';

import { NgScrollbarModule } from 'ngx-scrollbar';

import { StoreModule } from '@ngrx/store';
import { InterceptorService } from './shared/loader/interceptor.service';
// import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
// import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
// import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { ApiInterceptor } from './shared/helper/api-interceptor';
import { NgxsModule } from "@ngxs/store";

// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent } from './containers';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule
} from '@coreui/angular';

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { AsyncService } from './shared/services/async.service';
import { CommonService } from './shared/services/common.service';
import { DefaultTitlebarComponent } from './containers/default-layout/default-titlebar/default-titlebar/default-titlebar.component';
import { AsyncState } from './shared/state/async.state';
// import { PosModule } from './views/pos/pos.module';

const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent
];

@NgModule({
  declarations: [AppComponent, ...APP_CONTAINERS, DefaultTitlebarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    FormsModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    MaterialModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    NgScrollbarModule,
    HttpClientModule,
    MatDialogModule,
    DatePipe,
    ToastrModule.forRoot(),
    StoreModule.forRoot(),
    NgxsModule.forRoot([AsyncState], {
      developmentMode: !environment.production
    }),
    // NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
    // NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    // PosModule,
  ],
  providers: [
    BnNgIdleService,
    AsyncService,
    CommonService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    Title,
    { provide: "BASE_API_URL", useValue: environment.baseUrl },
    { provide: "Test_API_URL", useValue: environment.testUrl },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
