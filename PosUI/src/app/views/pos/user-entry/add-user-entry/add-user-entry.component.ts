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
import { UserEntryService } from 'src/app/views/pos/services/user-entry.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { UserCategoryService } from '../../services/user-category.service';

@Component({
  selector: 'app-add-user-entry',
  templateUrl: './add-user-entry.component.html',
  styleUrls: ['./add-user-entry.component.scss']
})
export class AddUserEntryComponent {
  public favoriteColor = '#26ab3c';
  formId = 'category';
  userEntryForm: any = FormGroup;
  paramId: number = 0;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  loginUser: string= '';
  userCategoryName: string= '';
  // authSub: Subscription;
  duplicateSub?: Subscription;
  subscription?: Subscription;
  // addSub: Subscription;
  // paramSub: Subscription;
  // empListSub: Subscription;
  itemArray: any = [];
  userCategoryList: any = [];

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    private notificationService: NotificationService,
    public userEntryService: UserEntryService,
    private userCategoryService: UserCategoryService
  ) {}

  ngOnInit(): void {
    this.authInfo();
    this.formInfo();
    this. getUserCategoryList();
    this.paramId = this.route.snapshot.params.id;
    if (this.paramId) {
      this.isParam()
    };
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Update User List' : 'Add User List',
      editPath: '/pos/user/view',
      formId: this.formId,
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.userEntryForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      userCategory: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.userEntryForm.controls;
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

  isParam() {
     this.userEntryService.getSingleUser(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.userEntryForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.userEntryForm.valid)) {
      this.commonService.showDialog({
        title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
        content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
      },
        () => this.paramId ? this.updateUser() : this.addUser()
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
        if (this.userEntryForm.value.name == entry['name']) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.userEntryForm.valid) {
      this.duplicateSub = this.userEntryService.duplicateCheck(this.userEntryForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.itemArray.push(this.userEntryForm.value);
            for(let i = 0; i < this.userCategoryList.length; i++)
            {
              for(let j = 0; j < this.itemArray.length; j++)
              {
                if(this.itemArray[j].category == this.userCategoryList[i].category_code)
                {
                  this.userCategoryName = this.userCategoryList[i].name
                }
              }
            }
            this.userEntryForm.reset();
            this.userEntryForm.get('createdBy')?.setValue(this.loginUser);
            this.userEntryForm.get('createdDate')?.setValue(this.currentDate);
            this.formInfo();
          }
        });
    } else {
      this.commonService.showErrorMsg('Please fill up with valid data!!!!');
    }
  }

  addUser() {
    this.userEntryService
      .addUser(this.itemArray).subscribe(
        (add: IApiResponse) => {
          if (add.isExecuted) 
          {
            this.router.navigateByUrl('/pos/user/view');
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

  updateUser() {
     this.userEntryService
      .updateUser(this.userEntryForm.value).subscribe(
        (add:any) => {
          if (add['isExecuted'])
          {
            this.commonService.showSuccessMsg(add['message'])
            this.router.navigateByUrl('/pos/user/view');
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
    // this.asyncService.finish();
  }
}
