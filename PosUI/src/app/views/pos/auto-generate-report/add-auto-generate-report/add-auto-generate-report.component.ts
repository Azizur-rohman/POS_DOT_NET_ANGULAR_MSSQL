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
import { CategoryService } from 'src/app/views/pos/services/category.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-add-auto-generate-report',
  templateUrl: './add-auto-generate-report.component.html',
  styleUrls: ['./add-auto-generate-report.component.scss']
})
export class AddAutoGenerateReportComponent {

  public favoriteColor = '#26ab3c';
  formId = 'category';
  categoryForm: any = FormGroup;
  paramId: number = 0;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  loginUser: string= '';
  // authSub: Subscription;
  duplicateSub?: Subscription;
  // addSub: Subscription;
  // paramSub: Subscription;
  // empListSub: Subscription;
  itemArray: any = [];

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    private notificationService: NotificationService,
    public categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authInfo();
    this.formInfo();
    this.paramId = this.route.snapshot.params.id;
    if (this.paramId) {
      this.isParam()
    };
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Update Auto Generate Reports' : 'Add Auto Generate Reports',
      editPath: '/pos/category/view',
      formId: this.formId,
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.categoryForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  isParam() {
     this.categoryService.getSingleCategory(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.categoryForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.categoryForm.valid)) {
      this.commonService.showDialog({
        title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
        content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
      },
        () => this.paramId ? this.updateCategory() : this.addCategory()
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
        if (this.categoryForm.value.name == entry['name']) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.categoryForm.valid) {
      this.duplicateSub = this.categoryService.duplicateCheck(this.categoryForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.itemArray.push(this.categoryForm.value);
            // this.categoryForm.get('name')?.setValue(null);
            this.categoryForm.reset();
            this.categoryForm.get('createdBy')?.setValue(this.loginUser);
            this.categoryForm.get('createdDate')?.setValue(this.currentDate);
            this.formInfo();
          }
        });
    } else {
      this.commonService.showErrorMsg('Please fill up with valid data!!!!');
    }
  }

  addCategory() {
    this.categoryService
      .addCategory(this.itemArray).subscribe(
        (add: IApiResponse) => {
          if (add.isExecuted) 
          {
            this.router.navigateByUrl('/pos/category/view');
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

  updateCategory() {
     this.categoryService
      .updateCategory(this.categoryForm.value).subscribe(
        (add:any) => {
          if (add['isExecuted'])
          {
            this.commonService.showSuccessMsg(add['message'])
            this.router.navigateByUrl('/pos/category/view');
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
    // if (this.empListSub) {
    //   this.empListSub.unsubscribe();
    // }
    // this.asyncService.finish();
  }
}

