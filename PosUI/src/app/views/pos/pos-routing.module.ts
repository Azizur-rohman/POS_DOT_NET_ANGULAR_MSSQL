import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './category/add-category/add-category.component';
import { ViewCategoryComponent } from './category/view-category/view-category.component';
import { AddProductComponent } from './Product/add-product/add-product.component';
import { ViewProductComponent } from './Product/view-product/view-product.component';
import { ViewStockManagementComponent } from './stock-management/view-stock-management/view-stock-management.component';
import { AddStockManagementComponent } from './stock-management/add-stock-management/add-stock-management.component';
import { ViewUserCategoryComponent } from './user-category/view-user-category/view-user-category.component';
import { AddUserCategoryComponent } from './user-category/add-user-category/add-user-category.component';
import { hasRoleGuard } from 'src/app/views/pages/services/has-role.guard';
import { AddUserEntryComponent } from './user-entry/add-user-entry/add-user-entry.component';
import { ViewUserEntryComponent } from './user-entry/view-user-entry/view-user-entry.component';
import { ViewSaleComponent } from './sale/view-sale/view-sale.component';
import { AddSaleComponent } from './sale/add-sale/add-sale.component';
import { AddUserRoleComponent } from './user-role/add-user-role/add-user-role.component';
import { ViewUserRoleComponent } from './user-role/view-user-role/view-user-role.component';
import { AddMenuPathComponent } from './menu-path/add-menu-path/add-menu-path.component';
import { ViewMenuPathComponent } from './menu-path/view-menu-path/view-menu-path.component';
import { AddAutoGenerateReportComponent } from './auto-generate-report/add-auto-generate-report/add-auto-generate-report.component';
import { ViewMenuComponent } from './menu/view-menu/view-menu.component';
import { AddMenuComponent } from './menu/add-menu/add-menu.component';

const routes: Routes = [
  
      { 
        path: 'category', component: AddCategoryComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'category/view', component: ViewCategoryComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'product', component: AddProductComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'product/view', component: ViewProductComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'stock-management', component: AddStockManagementComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'stock-management/view', component: ViewStockManagementComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'user-category', component: AddUserCategoryComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'user-category/view', component: ViewUserCategoryComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
      { path: 'user', component: AddUserEntryComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'user/view', component: ViewUserEntryComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
      { path: 'sale', component: AddSaleComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'sale/view', component: ViewSaleComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
      { path: 'menu-path', component: AddMenuPathComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'menu-path/view', component: ViewMenuPathComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
      { path: 'user-role', component: AddUserRoleComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'user-role/view', component: ViewUserRoleComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
      { path: 'auto-generate-report', component: AddAutoGenerateReportComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
      { path: 'menu', component: AddMenuComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }
      },
      { path: 'menu/view', component: ViewMenuComponent,
        canActivate: [hasRoleGuard],
        data:
        {
          role:[]
        }  
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosRoutingModule { }
