import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { IApiResponse } from 'src/app/shared/container/api-response.model';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SaleService } from '../../services/sale.service';
import { StockManagementService } from '../../services/stock-management.service';
import { CategoryService } from '../../services/category.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.scss']
})
export class AddSaleComponent {
  formId = 'add-sale';
  saleForm: any = FormGroup;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  fromDate: any ;
  fromDateArr: any ;
  endDate: any ;
  loginUser: string= '';
  authSubs?: Subscription;
  paramId: number = 0;
  userId: string = '';
  empInfoSub?: Subscription;
  empListSubs?: Subscription;
  duplicateSub?: Subscription;
  paramSub?: Subscription;
  salHeadSubs?: Subscription;
  // maxRuleSubs: Subscription;
  // delSalSub: Subscription;
  docIndexNo: number = 0;
  orderNo: string = '';
  desigList: any;
  displayName: string = '';
  displayDesig: string = '';
  categoryList: any = [];
  maxRule: any;
  selectedDate: any;
  isDesigExists: boolean = false;
  isDesgBtnOff: boolean = false;
  isSalBtnOff: boolean = false;
  productList: any = [];
  productFilterList: any = [];
  saleDtlHeadArr: saleDetail[] = [];
  totalAmount: number = 0;
  total: number = 0;
  // maxquantity: number = 0;
  deleteArr: any = [];


  constructor(
    private commonService: CommonService,
    private asyncService: AsyncService,
    private fb: FormBuilder,
    public saleService: SaleService,
    public route: ActivatedRoute,
    public router: Router,
    private stockManagementService: StockManagementService,
    private categoryService: CategoryService
    ) {
  }

  ngOnInit() {
    this.authInfo();
    this.generateItemCode();
    this.formInfo();
    this.paramId = this.route.snapshot.params.id;
    this.userId = this.route.snapshot.params.userid;
    // this.employeeList();
    // this.filterData();
    this.uiInfo();
    if (this.paramId) {
      this.isParam()
    };
    this.getProductList();
    this.getCategoryList();
    this.addSaleDetailGroup();
    this.toggleSaleDetailRemoveBtn();
  }

  formInfo() {
    this.saleForm = this.fb.group({
      id: 0,
      orderNo: [this.orderNo],
      customerName: ['', Validators.required],
      customerPhone: [''],
      customerAddress: [''],
      totalAmount: [null],
      discount: [null],
      vat: [null],
      grandTotalAmount: [null],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    })
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: this.paramId ? 'Edit Sale' : 'Add Sale',
      editPath: '/pos/sale/view',
      formId: this.formId
    })
  };

  get f() {
    return this.saleForm.controls;
  }

  // filterData() {
  //   this.saleForm.get('employee_code').valueChanges.pipe(
  //     debounceTime(500),
  //     switchMap(changedValue =>
  //       this.lovService.getEmpBySearchForCarReimburse(changedValue)
  //     ),
  //   ).subscribe(searchEmpList => {
  //     if (searchEmpList) {
  //       this.employeeFilterList = searchEmpList['data']
  //     } else {
  //       this.employeeFilterList = [];
  //     }
  //   }
  //   )
  //   this.myForm.get('employee_code').valueChanges.subscribe(value =>
  //     this.inputValue = value
  //   )
  // }

  // employeeList() {
  //   this.empListSubs = this.lovService.getEmpBySearchForCarReimburse().subscribe((data) => {
  //     this.employeeFilterList = data['data'];
  //   }, (error) => {
  //     this.commonService.showErrorMsg(error.message);
  //   })
  // };
  // checkInput() {
  //   if (!this.paramId) {
  //     setTimeout(() => {
  //       if (this.inputValue) {
  //         this.systemEmployeeInfo(this.inputValue);
  //       } else {
  //         if (this.displayName) {
  //           this.displayName = null;
  //           this.displayDesig = null;
  //         }
  //       }
  //     }, 100)
  //   }
  // }
  // systemEmployeeInfo(empId) {
  //   this.empInfoSub = this.lovService.getEmpInfo(empId).subscribe(
  //     (res: IApiResponse) => {
  //       if (res.info.category == 'CT001') {
  //         let empInfo = res.info;
  //         this.myForm.get('employee_code').setValue(empInfo?.employee_code);
  //         this.myForm.get('employee_name').setValue(empInfo?.employee_name);
  //         this.myForm.get('designation').setValue(empInfo?.designation);
  //         this.myForm.get('designation_name').setValue(empInfo?.designation_name);
  //         this.myForm.get('branch').setValue(empInfo?.branch);
  //         this.myForm.get('branch_name').setValue(empInfo?.branch_name);
  //         this.myForm.get('division').setValue(empInfo?.division);
  //         this.myForm.get('division_name').setValue(empInfo?.division_name);
  //         this.myForm.get('department').setValue(empInfo?.department);
  //         this.myForm.get('department_name').setValue(empInfo?.department_name);
  //       } else {
  //         this.commonService.showErrorMsg('You can not apply car reimburse');
  //         this.router.navigate(['/car-allowance/car-reimburse-apply-hr/add']);
  //       }
  //     },
  //     (error) => {
  //       this.commonService.showErrorMsg(error.message);
  //     }
  //   );
  // }

  getCategoryList() {
    this.asyncService.start();
    this.salHeadSubs = this.categoryService.getCategoryList().subscribe(getData => {
      this.categoryList = getData['data'];
    });
    this.asyncService.finish();
  }

  getProductList() {
    this.asyncService.start();
    this.salHeadSubs = this.stockManagementService.getStockManagementList().subscribe(getData => {
      let filterData = getData['data'];
      if(this.paramId){
        this.productList = filterData;
      }else{
      this.productList = filterData.filter((x: any)=> x.quantity != 0);
      }
    });
    this.asyncService.finish();
  }
  // SetformDateArr(){
  //   // this.fromDateArr = this.carRimbDtlHeadArr.map(x=>x.from_date);
  //   for (let i = 0; i < this.carRimbDtlHeadArr.length; i++) {
  //     this.fromDateArr = this.carRimbDtlHeadArr[i].from_date;
  //   }
  // }
  // SetformDate(){
  //   this.fromDate = this.myForm.value.from_date;
  // }
  // SetendDate(){
  //   this.endDate = this.myForm.value.end_date;
  // }

  addSaleDetailGroup() {
    this.saleDtlHeadArr.push({
      id: 0,
      serial_no: 0,
      productCode: '',
      categoryCode: '',
      categoryName: '',
      view_code: '',
      maxQuantity: 0,
      salePrice: 0,
      quantity: 0,
      subTotalAmount: 0,
    });
    for (let i = 0; i < this.saleDtlHeadArr.length; i++) {
      this.saleDtlHeadArr[i].serial_no = i + 1;
    }
    this.toggleSaleDetailRemoveBtn();
  }

  removeSaleDetailGroup(sal: any, indx: number) {
    this.saleDtlHeadArr.splice(indx, 1);
    for (let i = 0; i < this.saleDtlHeadArr.length; i++) {
      this.saleDtlHeadArr[i].serial_no = i + 1;
    }
     if(this.paramId && sal.id > 0)
    {
      this.deleteArr.push(sal);
    }
    this.sumTotalAmount();
    this.discount();
    this.vat();
    this.toggleSaleDetailRemoveBtn();
    this.productCodeEnableDisable();
  }

  toggleSaleDetailRemoveBtn() {
    if (this.saleDtlHeadArr.length < 2) {
      this.isSalBtnOff = true;
    } else {
      this.isSalBtnOff = false;
    }
  }

  onSelectSaleDetail(event: any, i: any) {
    let index = this.productList.findIndex((x: any) => x.productCode === event.target.value);
    this.saleDtlHeadArr[i].view_code = this.productList[index].productCode;
    this.saleDtlHeadArr[i].categoryCode = this.productList[index].categoryCode;
    this.saleDtlHeadArr[i].salePrice = this.productList[index].sale_price;
    this.saleDtlHeadArr[i].quantity = this.productList[index].quantity;
    this.saleDtlHeadArr[i].categoryName = this.productList[index].category;
    this.saleDtlHeadArr[i].maxQuantity =this.saleDtlHeadArr[i].quantity;
    this.productCodeEnableDisable();
    this.quantity(i);
    this.salePrice(i);
  }

  generateItemCode(): string {
    const uuid = uuidv4();
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().substr(0, 10).replace(/-/g, '');
    const sequentialNumber = formattedDate; // Implement this function
    const itemCode = `${formattedDate}-${uuid}`;
    this.orderNo = itemCode;
    return itemCode;
  }
  


  quantity(i: any){
    for (let j = 0; j < this.saleDtlHeadArr.length; j++) {
      if(j == i){
        this.saleDtlHeadArr[j].subTotalAmount = 0;
        this.saleDtlHeadArr[j].subTotalAmount =  this.saleDtlHeadArr[j].quantity *  this.saleDtlHeadArr[j].salePrice
      }
    }
    this.sumTotalAmount();
    this.totalAmount = this.sumTotalAmount();
    this.discount();
    this.vat();
  }

  salePrice(i: any) {
    for (let j = 0; j < this.saleDtlHeadArr.length; j++) {
      if(j == i){
        this.saleDtlHeadArr[j].subTotalAmount = 0;
        this.saleDtlHeadArr[j].subTotalAmount =  this.saleDtlHeadArr[j].quantity *  this.saleDtlHeadArr[j].salePrice
      }
    }
    this.sumTotalAmount();
    this.totalAmount = this.sumTotalAmount();
    this.discount();
    this.vat();
  }

  sumTotalAmount() {
    this.total = this.saleDtlHeadArr.map(x => x.subTotalAmount).reduce((key, value) => key + value, 0.00);
    return this.total
  }

  discount()
  {
    if(this.saleForm.value.vat > 0)
    {
    let discount = this.sumTotalAmount() * (this.saleForm.value.discount / 100);
    let vat = this.sumTotalAmount() * (this.saleForm.value.vat / 100);
    this.totalAmount = this.sumTotalAmount() - discount + vat;
    }else{
    // let disVat = Math.abs(this.saleForm.value.discount - this.saleForm.value.vat)
    let discount = this.sumTotalAmount() * (this.saleForm.value.discount / 100);
    this.totalAmount = this.sumTotalAmount() - discount;
    }
  }

  vat()
  {
    if(this.saleForm.value.discount > 0)
    {
    let vat = this.sumTotalAmount() * (this.saleForm.value.vat / 100);
    let discount = this.sumTotalAmount() * (this.saleForm.value.discount / 100);
    this.totalAmount = this.sumTotalAmount() + vat - discount;
    }else{
    // let vatDis = Math.abs(this.saleForm.value.vat - this.saleForm.value.discount)
    let vat = this.sumTotalAmount() * (this.saleForm.value.vat / 100);
    this.totalAmount = this.sumTotalAmount() + vat;
    }
  }
  productCodeEnableDisable() {
    if (this.saleDtlHeadArr.length > 0) {
      for (let i = 0; i < this.productList.length; i++) {
        this.productList[i].isDisable = false;
      }

      for (let j = 0; j < this.saleDtlHeadArr.length; j++) {
        let ctCode = this.saleDtlHeadArr[j].productCode;
        this.productList.map((x: any) => {
          if (x.productCode == ctCode) {
            x.isDisable = true;
          }
        });
      }
    }
  }

  addSaleSetup() {
    this.asyncService.start();
    this.saleService.addSale(
      this.saleForm.value,
      this.saleDtlHeadArr,
    ).subscribe((res: any) => {
      if (res['isExecuted'] == true) {
        this.commonService.showSuccessMsg(res['message']);
        this.commonService.refreshViaHome('/pos/sale/view');
      } else {
        this.commonService.showErrorMsg(res['message']);
      }
      this.asyncService.finish();
    });
  }

  isParam() {
    this.asyncService.start();
    this.paramSub =
      this.saleService.getSingleSale(this.paramId).subscribe((res: IApiResponse) => {
        if (res.isExecuted == true) {
          this.saleForm.patchValue({ ...res.data.master[0], updatedBy: this.loginUser });
          this.saleDtlHeadArr = res.data.details;
          this.productCodeEnableDisable();
          for (let i = 0; i < this.saleDtlHeadArr.length; i++) {
            this.saleDtlHeadArr[i].serial_no = i + 1;
            this.saleDtlHeadArr[i].maxQuantity = this.saleDtlHeadArr[i].quantity;            
            this.stockManagementService.getStockManagementList().subscribe(getData => {
              let singleProduct = getData['data'];
              let category = singleProduct.find((x: any) => x.categoryCode === this.saleDtlHeadArr[i].categoryCode)?.category;
              this.saleDtlHeadArr[i].categoryName = category;
            });
               
          }
        }
        else {
          this.commonService.showErrorMsg(res.message);
        }
        this.asyncService.finish();
      }, (err) => {
        this.asyncService.finish();
        this.commonService.showErrorMsg(err.message);
      })
  };

  async onSaveConfirmation() {

    if (this.duplicateSaleCodeCheck() == true) {
        this.commonService.showErrorMsg('Duplicate found!!')
    } else {
      if (this.saleForm.valid) {
        if(await this.SaleDetailArrayValidCheck()){
          this.commonService.showDialog({
            title: this.paramId ? 'Confirmation - update record' : 'Confirmation - save record',
            content: this.paramId ? 'Do you want to update record?' : 'Do you want to save record?',
          },
            () => this.paramId ? this.updateSale() : this.addSaleSetup()
          );
        }
      } else {
        this.commonService.showErrorMsg('Please fill the required fields!');
      }
    }
  };


  duplicateSaleCodeCheck() {
    var valueArr = this.saleDtlHeadArr.map(function (item) { return item.productCode });
    var isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx
    });
    return isDuplicate;
  }

  updateSale() {
    this.asyncService.start();
    this.saleService.updateSale(
      this.saleForm.value,
      this.saleDtlHeadArr,
      this.deleteArr,
    ).subscribe((res: any) => {
      if (res['isExecuted'] == true) {
        this.commonService.showSuccessMsg(res['message']);
        this.commonService.refreshViaHome('/pos/sale/view');
      } else {
        this.commonService.showErrorMsg(res['message']);
      }
      this.asyncService.finish();
    });
  };

  async onDeleteConfirmation(sal: any, indx: number) {
    this.commonService.showDialog(
      {
        title: 'Confirmation - Delete Record',
        content: 'Do you want to delete record?',
      },
      () => this.removeSaleDetailGroup(sal, indx)
    );
  };

  SaleDetailArrayValidCheck() {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.saleDtlHeadArr.length; i++) {
        if (this.saleDtlHeadArr[i].productCode == '') {
          return this.commonService.showErrorMsg('Product Name can not be NULL');
        }
      };
      resolve(true);
    });
  }



  ngOnDestroy() {
    if (this.authSubs) {
      this.authSubs.unsubscribe();
    }
    if (this.salHeadSubs) {
      this.salHeadSubs.unsubscribe();
    }
    this.asyncService.finish();
  }

}

interface saleDetail {
  id: number,
  serial_no: number,
  productCode: string,
  categoryCode: string,
  categoryName: string,
  view_code: string,
  maxQuantity: number,
  salePrice: number,
  quantity: number,
  subTotalAmount: number
}