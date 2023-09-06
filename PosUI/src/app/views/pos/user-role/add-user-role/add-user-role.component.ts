import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
// import { AuthService } from 'src/app/auth/auth.service';
// import { AsyncService } from 'src/app/shared/services/async.service';
import { IApiResponse } from 'src/app/shared/container/api-response.model';
import { ToastrService } from 'ngx-toastr';
import { UserRoleService } from 'src/app/views/pos/services/user-role.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { UserCategoryService } from '../../services/user-category.service';
import { MenuPathService } from '../../services/menu-path.service';

@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})
export class AddUserRoleComponent {

  public favoriteColor = '#26ab3c';
  formId = 'user-role';
  userRoleForm: any = FormGroup;
  paramId: number = 0;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  loginUser: string= '';
  userCategoryName: string= '';
  menuPath: string= '';
  // authSub: Subscription;
  duplicateSub?: Subscription;
  subscription?: Subscription;
  getSub?: Subscription;
  // paramSub: Subscription;
  // empListSub: Subscription;
  itemArray: any = [];
  userCategoryList: any = [];
  menuPathList: any = [];

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    private notificationService: NotificationService,
    public UserRoleService: UserRoleService,
    private userCategoryService: UserCategoryService,
    public menuPathService: MenuPathService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authInfo();
    this.formInfo();
    this.getUserCategoryList();
    this.getUserMenuPathList();
    this.paramId = this.route.snapshot.params.id;
    if (this.paramId) {
      this.isParam()
    };
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Update User Role List' : 'Add User Role List',
      editPath: '/pos/user-role/view',
      formId: this.formId,
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.userRoleForm = this.fb.group({
      id: [0],
      userCategory: ['', Validators.required],
      userCategoryName: [''],
      pathId: ['', Validators.required],
      path: [''],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.userRoleForm.controls;
  }

  getUserCategoryList() {
    // this.asyncService.start();
    this.subscription =
    this.userCategoryService.getUserCategoryList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.userCategoryList = getData['data'] ;
      }
      else {
        this.commonService.showErrorMsg(getData['message']);
      }
      // this.asyncService.finish();
    }, (err) => {
      // this.asyncService.finish();
      this.commonService.showErrorMsg(err.message);
    })
  };

  getUserMenuPathList() {
    // this.asyncService.start();
    this.getSub =
    this.menuPathService.getMenuPathList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.menuPathList = getData['data'] ;
      }
      else {
        this.commonService.showErrorMsg(getData['message']);
      }
      // this.asyncService.finish();
    }, (err) => {
      // this.asyncService.finish();
      this.commonService.showErrorMsg(err.message);
    })
  };

  onSelectUserCategory(event: any) {
    let userCategory = this.userCategoryList.find((x: any)=> x.user_category_code == event.target.value).user_category_name
    this.userRoleForm.get('userCategoryName')?.setValue(userCategory);
  }

  onSelectPath(event: any) {
    let menuPath = this.menuPathList.find((x: any)=> x.path_id == event.target.value)
    this.userRoleForm.get('path')?.setValue(menuPath);
  }

  isParam() {
     this.UserRoleService.getSingleUserRole(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.userRoleForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.userRoleForm.valid)) {
      this.commonService.showDialog({
        title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
        content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
      },
        () => this.paramId ? this.updateUserRole() : this.addUserRole()
      );
    } else {
      this.commonService.showErrorMsg('Table is empty!! Please first add data in array table!');
    }
  };

  onDeleteItem(index: any) {
    this.itemArray.splice(index, 1);
  }

  addDataToArray() {
    if (this.itemArray) {
      for (let entry of this.itemArray) {
        if (this.userRoleForm.value.userCategory == entry['userCategory'] && this.userRoleForm.value.pathId == entry['pathId'] ) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.userRoleForm.valid) {
      this.duplicateSub = this.UserRoleService.duplicateCheck(this.userRoleForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.itemArray.push(this.userRoleForm.value);
            for(let i = 0; i < this.userCategoryList.length; i++)
            {
              for(let j = 0; j < this.itemArray.length; j++)
              {
                if(this.itemArray[j].userCategory == this.userCategoryList[i].user_category_code)
                {
                  this.itemArray[j].userCategoryName = this.userCategoryList[i].user_category_name
                }
              }
            }
            for(let i = 0; i < this.menuPathList.length; i++)
            {
              for(let j = 0; j < this.itemArray.length; j++)
              {
                if(this.itemArray[j].pathId == this.menuPathList[i].path_id)
                {
                  this.itemArray[j].path = this.menuPathList[i].path
                }
              }
            }
            this.userRoleForm.reset();
            this.userRoleForm.get('createdBy')?.setValue(this.loginUser);
            this.userRoleForm.get('createdDate')?.setValue(this.currentDate);
            this.formInfo();
          }
        });
    } else {
      this.commonService.showErrorMsg('Please fill up with valid data!!!!');
    }
  }

  addUserRole() {
    this.UserRoleService
      .addUserRole(this.itemArray).subscribe(
        (add: IApiResponse) => {
          if (add.isExecuted) 
          {
            this.router.navigateByUrl('/pos/user-role/view');
            this.commonService.showSuccessMsg(add.message)
          } 
          else 
          {
            this.commonService.showErrorMsg(add.message)
          }
        },
        (err) => {
        }
      );
  };

  updateUserRole() {
     this.UserRoleService
      .updateUserRole(this.userRoleForm.value).subscribe(
        (add:any) => {
          if (add['isExecuted'])
          {
            this.commonService.showSuccessMsg(add['message'])
            this.router.navigateByUrl('/pos/user-role/view');
          }
          else
          {
            this.commonService.showErrorMsg(add['message'])
          }
        },
        (err) => {
          this.commonService.showErrorMsg(err.message)
        }
      );
  };

  

  ngOnDestroy() {
    // if (this.authSub) {
    //   this.authSub.unsubscribe();
    // }
    if (this.duplicateSub) {
      this.duplicateSub.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.getSub) {
      this.getSub.unsubscribe();
    }
    // if (this.empListSub) {
    //   this.empListSub.unsubscribe();
    // }
    // this.asyncService.finish();
  }
}

