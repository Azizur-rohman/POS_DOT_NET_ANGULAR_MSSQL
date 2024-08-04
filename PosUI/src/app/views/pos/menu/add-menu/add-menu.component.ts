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
import { MenuPathService } from 'src/app/views/pos/services/menu-path.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent {

  public favoriteColor = '#26ab3c';
  formId = 'menu';
  menuPathForm: any = FormGroup;
  paramId: number = 0;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  loginUser: string= '';
  // authSub: Subscription;
  duplicateSub?: Subscription;
  subscription?: Subscription;
  // addSub: Subscription;
  // paramSub: Subscription;
  // empListSub: Subscription;
  itemArray: any = [];
  menuList: any = [];

  iconComponentList: any =[
    {name: 'cil-speedometer'},
    {name: 'cil-file'},
    {name: 'cilUser'},
    {name: 'cil-star'},
  ]

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    private notificationService: NotificationService,
    public menuPathService: MenuPathService,
    private toastr: ToastrService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.authInfo();
    this.formInfo();
    this.paramId = this.route.snapshot.params.id;
    this. getMenuList();
    if (this.paramId) {
      this.isParam()
    };
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Update Menu List' : 'Add Menu List',
      editPath: '/pos/menu/view',
      formId: this.formId,
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.menuPathForm = this.fb.group({
      id: [0],
      serialNo: [null, Validators.required],
      menuName: ['', Validators.required],
      iconComponent: [''],
      badgeColor: [''],
      badgeText: [''],
      title: [null],
      menuPath: ['', Validators.required],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.menuPathForm.controls;
  }

  getMenuList() {
    // this.asyncService.start();
    this.subscription =
    this.menuService.getMenuList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.menuList = getData['data'] ;
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
     this.menuService.getSingleMenu(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.menuPathForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.menuPathForm.valid)) {
      this.commonService.showDialog({
        title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
        content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
      },
        () => this.paramId ? this.updateMenuPath() : this.addMenuPath()
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
        if (this.menuPathForm.value.path == entry['path'] || this.menuPathForm.value.menu == entry['menu']) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.menuPathForm.valid) {
      this.duplicateSub = this.menuService.duplicateCheck(this.menuPathForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.itemArray.push(this.menuPathForm.value);
            this.menuPathForm.get('menu')?.setValue(this.menuList.find((x: any)=> x.menuId == this.menuPathForm.value.menuId)?.menu_name);
            // this.menuPathForm.get('name')?.setValue(null);
            this.menuPathForm.reset();
            this.menuPathForm.get('createdBy')?.setValue(this.loginUser);
            this.menuPathForm.get('createdDate')?.setValue(this.currentDate);
            this.formInfo();
          }
        });
    } else {
      this.commonService.showErrorMsg('Please fill up with valid data!!!!');
    }
  }

  addMenuPath() {
    this.menuService
      .addMenu(this.itemArray).subscribe(
        (add: IApiResponse) => {
          if (add.isExecuted) 
          {
            this.router.navigateByUrl('/pos/menu/view');
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

  updateMenuPath() {
     this.menuService
      .updateMenu(this.menuPathForm.value).subscribe(
        (add:any) => {
          if (add['isExecuted'])
          {
            this.commonService.showSuccessMsg(add['message'])
            this.router.navigateByUrl('/pos/menu/view');
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

