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
import { ProductService } from 'src/app/views/pos/services/product.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { CategoryService } from '../../services/category.service';
import { StockManagementService } from '../../services/stock-management.service';


@Component({
  selector: 'app-add-stock-management',
  templateUrl: './add-stock-management.component.html',
  styleUrls: ['./add-stock-management.component.scss']
})
export class AddStockManagementComponent {
  formId = 'stock-management';
  stockManagementForm: any = FormGroup;
  paramId: number = 0;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  loginUser: string= '';
  categoryCode: string= '';
  categoryName: string= '';
  // authSub: Subscription;
  duplicateSub?: Subscription;
  subscription?      : Subscription;
  // addSub: Subscription;
  // paramSub: Subscription;
  categoryList: any = [];
  productList: any = [];
  fetchList: any = [];
  itemArray: any = [];
  imageUrl: any;
  imageSrc: string | undefined;
  selectedFile: File | undefined;

  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    public stockManagementService: StockManagementService,
    public productService: ProductService,
    public categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.authInfo();
    this.formInfo();
    this. getCategoryList();
    this.getProductList();
    this.paramId = this.route.snapshot.params.id;
    if (this.paramId) {
      this.isParam()
    };
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Update Stock Management List' : 'Add Stock Management List',
      editPath: '/pos/stock-management/view',
      formId: this.formId,
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.stockManagementForm = this.fb.group({
      id: [0],
      product: ['', Validators.required],
      name:[''],
      category: ['', Validators.required],
      image: [''],
      PurchasePrice: [null],
      salePrice: [null, Validators.required],
      quantity: [null, Validators.required],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.stockManagementForm.controls;
  }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0] as File;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imageSrc = reader.result as string;
  //     this.stockManagementForm.get('image').setValue(this.imageSrc);
  //   };
  //   reader.readAsDataURL(this.selectedFile);
  // }

  getCategoryList() {
    // this.asyncService.start();
    this.subscription =
    this.categoryService.getCategoryList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.categoryList = getData['data'] ;
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

  getProductList() {
    // this.asyncService.start();
    this.subscription =
    this.productService.getProductList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.fetchList = getData['data'] ;
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

  onSelectCategory(event: any) {
    this.productList = this.fetchList.filter((x: any)=> x.category_code == event.target.value)
    const newItem = {name : '--Select Product--'};
    this.productList.unshift(newItem);
    this.imageSrc = '';
    this.stockManagementForm.get('PurchasePrice').setValue(null);
    this.stockManagementForm.get('salePrice').setValue(null);

  }

  onSelectProduct(event: any){
    let name = this.fetchList.find((x: any)=> x.product_code == event.target.value)?.name;
    this.imageSrc = this.fetchList.find((x: any)=> x.product_code == event.target.value)?.image;
    let productPrice = this.fetchList.find((x: any)=> x.product_code == event.target.value)?.price;
    this.stockManagementForm.get('PurchasePrice').setValue(productPrice);
    this.stockManagementForm.get('salePrice').setValue(productPrice);
    this.stockManagementForm.get('name')?.setValue(name);
    
  }


  isParam() {
     this.stockManagementService.getSingleStockManagement(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.stockManagementForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
         this.productList = this.fetchList.filter((x: any)=> x.category_code == singleData.data.category);
         for(let i=0; i<this.fetchList.length; i++)
         {
          if(this.fetchList[i].product_code == singleData.data.product)
          {
            this.imageSrc = this.fetchList[i].image;
            this.stockManagementForm.get('PurchasePrice').setValue(this.fetchList[i].price)
          }
         }
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.stockManagementForm.valid)) {
      this.commonService.showDialog({
        title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
        content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
      },
        () => this.paramId ? this.updateStockManagement() : this.addStockManagement()
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
        if (this.stockManagementForm.value.product == entry['product'] && this.stockManagementForm.value.category == entry['category']) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.stockManagementForm.valid) {
      this.duplicateSub = this.stockManagementService.duplicateCheck(this.stockManagementForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.stockManagementForm.get('image')?.setValue(this.imageSrc);
            this.itemArray.push(this.stockManagementForm.value);
            // this.productForm.get('name')?.setValue(null);
            for(let i = 0; i < this.categoryList.length; i++)
            {
              for(let j = 0; j < this.itemArray.length; j++)
              {
                if(this.itemArray[j].category == this.categoryList[i].category_code)
                {
                  this.categoryName = this.categoryList[i].name
                }
              }
            }
            this.stockManagementForm.get('createdBy')?.setValue(this.loginUser);
            this.stockManagementForm.get('createdDate')?.setValue(this.currentDate);
            this.stockManagementForm.reset();
            this.imageSrc = '';
            this.formInfo();
          }
        });
    } else {
      this.commonService.showErrorMsg('Please fill up with valid data!!!!');
    }
  }

  addStockManagement() {
    this.stockManagementService
      .addStockManagement(this.itemArray).subscribe(
        (add: IApiResponse) => {
          if (add.isExecuted) 
          {
            this.router.navigateByUrl('/pos/stock-management/view');
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

  updateStockManagement() {
     this.stockManagementService
      .updateStockManagement(this.stockManagementForm.value).subscribe(
        (add:any) => {
          if (add['isExecuted'])
          {
            this.commonService.showSuccessMsg(add['message'])
            this.router.navigateByUrl('/pos/stock-management/view');
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
    // if (this.empListSub) {
    //   this.empListSub.unsubscribe();
    // }
    // this.asyncService.finish();
  }
}