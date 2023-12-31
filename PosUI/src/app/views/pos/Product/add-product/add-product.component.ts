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
const emptyProduct = require('src/assets/images/empty-product.js');

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  formId = 'product';
  productForm: any = FormGroup;
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
  itemArray: any = [];
  imageUrl: any;
  imageSrc: string | undefined;
  selectedFile: File | undefined;
  emptyProduct: string = '';
  constructor(
    public fb: FormBuilder,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    private route: ActivatedRoute,
    // public authService: AuthService,
    private notificationService: NotificationService,
    public productService: ProductService,
    public categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.authInfo();
    this.formInfo();
    this. getCategoryList();
    this.paramId = this.route.snapshot.params.id;
    if (this.paramId) {
      this.isParam()
    };
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Update Product List' : 'Add Product List',
      editPath: '/pos/product/view',
      formId: this.formId,
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.productForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      category: ['', Validators.required],
      image: [''],
      file: [''],
      price: [null, Validators.required],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.productForm.controls;
  }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0] as File;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imageSrc = reader.result as string;
  //     this.productForm.get('image').setValue(this.imageSrc);
  //   };
  //   reader.readAsDataURL(this.selectedFile);
  // }

  onFileSelected(event: any) {
    let files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        this.handleInputChangePhoto(file);
      }
    }
  };

  handleInputChangePhoto(files: any) {
    var file = files;
    // var pattern = /pdf/;
    var patternpng = /png/;
    var patternjpg = /jpg/;
    var patternjpeg = /jpeg/;
    var reader = new FileReader();
    if (!file.type.match(patternpng) && !file.type.match(patternjpg) && !file.type.match(patternjpeg)) {
      this.commonService.showErrorMsg('invalid format(Please upload only Image File)');
      this.productForm.get('file').setValue(null)
      this.productForm.get('image').setValue(null)
      return;
    }
    reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.productForm.get('image').setValue(this.imageSrc);
          
        };
        reader.readAsDataURL(file);
  };

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

  isParam() {
     this.productService.getSingleProduct(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.productForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
         this.imageSrc = singleData.data.image;
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.productForm.valid)) {
      this.commonService.showDialog({
        title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
        content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
      },
        () => this.paramId ? this.updateProduct() : this.addProduct()
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
        if (this.productForm.value.name == entry['name']) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.productForm.valid) {
      this.duplicateSub = this.productService.duplicateCheck(this.productForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.itemArray.push(this.productForm.value);
            this.emptyProduct = emptyProduct.imgBase64
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
            this.productForm.get('createdBy')?.setValue(this.loginUser);
            this.productForm.get('createdDate')?.setValue(this.currentDate);
            this.productForm.reset();
            this.imageSrc = '';
            this.formInfo();
          }
        });
    } else {
      this.commonService.showErrorMsg('Please fill up with valid data!!!!');
    }
  }

  addProduct() {
    this.productService
      .addProduct(this.itemArray).subscribe(
        (add: IApiResponse) => {
          if (add.isExecuted) 
          {
            this.router.navigateByUrl('/pos/product/view');
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

  updateProduct() {
     this.productService
      .updateProduct(this.productForm.value).subscribe(
        (add:any) => {
          if (add['isExecuted'])
          {
            this.commonService.showSuccessMsg(add['message'])
            this.router.navigateByUrl('/pos/product/view');
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
