import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosRoutingModule } from './pos-routing.module';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { IconModule } from '@coreui/icons-angular';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewCategoryComponent } from './category/view-category/view-category.component';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog/confirmation-dialog.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from './Product/add-product/add-product.component';
import { ViewProductComponent } from './Product/view-product/view-product.component';
import { ViewStockManagementComponent } from './stock-management/view-stock-management/view-stock-management.component';
import { AddStockManagementComponent } from './stock-management/add-stock-management/add-stock-management.component';
import { AddUserCategoryComponent } from './user-category/add-user-category/add-user-category.component';
import { ViewUserCategoryComponent } from './user-category/view-user-category/view-user-category.component';
import { AddUserEntryComponent } from './user-entry/add-user-entry/add-user-entry.component';
import { ViewUserEntryComponent } from './user-entry/view-user-entry/view-user-entry.component';
import { AddSaleComponent } from './sale/add-sale/add-sale.component';
import { ViewSaleComponent } from './sale/view-sale/view-sale.component';
import { ModalSaleComponent } from './sale/modal-sale/modal-sale.component';
import { AddMenuPathComponent } from './menu-path/add-menu-path/add-menu-path.component';
import { ViewMenuPathComponent } from './menu-path/view-menu-path/view-menu-path.component';
import { AddUserRoleComponent } from './user-role/add-user-role/add-user-role.component';
import { ViewUserRoleComponent } from './user-role/view-user-role/view-user-role.component';
import { AddAutoGenerateReportComponent } from './auto-generate-report/add-auto-generate-report/add-auto-generate-report.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';
import { ViewMenuComponent } from './menu/view-menu/view-menu.component';



@NgModule({
  declarations: [
  
    AddCategoryComponent,
    ViewCategoryComponent,
    ConfirmationDialogComponent,
    AddProductComponent,
    ViewProductComponent,
    ViewStockManagementComponent,
    AddStockManagementComponent,
    AddUserCategoryComponent,
    ViewUserCategoryComponent,
    AddUserEntryComponent,
    ViewUserEntryComponent,
    AddSaleComponent,
    ViewSaleComponent,
    ModalSaleComponent,
    AddMenuPathComponent,
    ViewMenuPathComponent,
    AddUserRoleComponent,
    ViewUserRoleComponent,
    AddAutoGenerateReportComponent,
    AddMenuComponent,
    ViewMenuComponent,
  ],
  imports: [
    CommonModule,
    PosRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatCardModule,
    MatDialogModule
  ]
})
export class PosModule { }
