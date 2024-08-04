import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { navItems } from 'src/app/containers/default-layout/_nav';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake!.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-auto-generate-report',
  templateUrl: './add-auto-generate-report.component.html',
  styleUrls: ['./add-auto-generate-report.component.scss']
})
export class AddAutoGenerateReportComponent {

  public favoriteColor = '#26ab3c';
  formId = 'auto-generate-report';
  autoReportForm: any = FormGroup;
  paramId: number = 0;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  loginUser: string= '';
  // authSub: Subscription;
  duplicateSub?: Subscription;
  // addSub: Subscription;
  // paramSub: Subscription;
  // empListSub: Subscription;
  itemArray: any = [];
  header: boolean = false;
  body: boolean = false;
  footer: boolean = false;
  margins: boolean = false;
  columns: boolean = false;
  columnSizeArr: any = [];
  headerItemArray: any = [];
  bodyFontSizes?: number = 0;

  items: any =[
    {code: 1, desc: 'Table'},
    {code: 2, desc: 'CheckBox'},
    {code: 3, desc: 'Column'},
    {code: 4, desc: 'margin'},
  ]

  mainItems: any =[
    {code: 1, desc: 'Header'},
    {code: 2, desc: 'Footer'},
    {code: 3, desc: 'Body'},
  ]

  alignElements: any =[
    {code: 'left', desc: 'Left'},
    {code: 'center', desc: 'Center'},
    {code: 'right', desc: 'Right'},
  ]

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
      goFullScreen: true
    });
  }

  authInfo() {
    let isLoggedIn: any = localStorage.getItem('isLoggedin');
    let localData: any = JSON.parse(isLoggedIn);
    this.loginUser = localData.name;
  }

  formInfo() {
    this.autoReportForm = this.fb.group({
      id: [0],
      mainItem: [''],
      headerItem: [''],
      bodyItem: [''],
      footerItem: [''],
      bodyFontSize: [0],
      item: [''],
      columnSize: [null],
      columnText:[''],
      columnAlign:[''],
      columnBold:[null],
      marginLeft: [0],
      marginTop: [0],
      marginRight: [0],
      marginBottom: [0],
      createdBy: [this.loginUser],
      createdDate: [this.currentDate],
      updatedBy: [this.loginUser],
      updatedDate: [this.currentDate]
    });
  }

  get f() {
    return this.autoReportForm.controls;
  }

  mainItem(event: any)
  {
    if(event?.target?.value == 1)
    {
      this.header = true;
      this.body = false;
      this.footer = false;
    }
    else if(event?.target?.value == 2)
      {
        this.header = false;
        this.body = false;
        this.footer = true;
      }
      else
      {
        this.header = false;
        this.body = true;
        this.footer = false;
      }
  }

  headItem(event: any)
  {
    if(event?.target?.value == 3)
      {
        this.margins = false;
        this.columns = true;
      }
    else if(event?.target?.value == 4)
    {
      this.margins = true;
      this.columns = false;
    }
    else{
      this.margins = false;
      this.columns = false;
    }
  }

  headMarginItems()
  {
    this.headerItemArray.push({
      // margin: '[' + this.autoReportForm.value.marginLeft + ', ' + this.autoReportForm.value.marginTop + ', '
      //   + this.autoReportForm.value.marginRight + ', ' + this.autoReportForm.value.marginBottom +
      // ']',
      margin: [this.autoReportForm.value.marginLeft, this.autoReportForm.value.marginTop,
          this.autoReportForm.value.marginRight, this.autoReportForm.value.marginBottom]
    })
    this.bodyFontSizes = this.autoReportForm.value.bodyFontSize;
  }

  headColumnItems(indx: any)
  {
    this.columnSizeArr.length = this.autoReportForm.value.columnSize
    for(let i = 0; i < this.headerItemArray?.length; i++)
    {
       if(this.headerItemArray[i].column)
       {
        this.headerItemArray = [];
       }
    }

    this.headerItemArray.push({
      // margin: '[' + this.autoReportForm.value.marginLeft + ', ' + this.autoReportForm.value.marginTop + ', '
      //   + this.autoReportForm.value.marginRight + ', ' + this.autoReportForm.value.marginBottom +
      // ']',
      column: { text: this.autoReportForm.value.columnText,
        align: this.autoReportForm.value.columnAlign,
        bold: this.autoReportForm.value.columnBold,
        margin: [this.autoReportForm.value.marginLeft, this.autoReportForm.value.marginTop,
          this.autoReportForm.value.marginRight, this.autoReportForm.value.marginBottom]
        }
      
    })
    this.bodyFontSizes = this.autoReportForm.value.bodyFontSize;
  }
  

  generateReport() {
    var bodyFontSize = this.bodyFontSizes;
    var headItems: any = [];
    headItems = this.headerItemArray;
    var headMargin = headItems[0]?.margin
    var headTable = headItems[0]?.table
    var headColumn = headItems[0]?.column

    //Head Column
    var columnSizeArray = this.columnSizeArr
    var headColumnText = headItems[0]?.column?.text
    var headColumnAlign = headItems[0]?.column?.align
    var headColumnBold = headItems[0]?.column?.bold
    var headColumnMargin = headItems[0]?.column?.margin

    //Head Table
    var headTableMargin = headItems[0]?.table?.margin
    var headTableWidth = headItems[0]?.table?.width
    var headTableHead = headItems[0]?.table?.head
    console.log('sadas', headItems[0]?.column?.text);
    
    var docDefinition: any = {
      header: function () {
        return {
          margin: headMargin,
          columns:  [
            headColumn ? [
              // {
              //   image: logo.imgBase64,
              //   width: 210,
              //   height: 55,
              //   alignment: 'center',
              //   margin: [0, 5, 20, 5]
              // },
              columnSizeArray.length == 1 ? {
                text: headColumnText,
                fontSize: bodyFontSize,
                bold: headColumnBold,
                alignment: headColumnAlign,
                margin: headColumnMargin
              }
              :
              columnSizeArray.length == 2 ? {
                text: headColumnText,
                fontSize: bodyFontSize,
                bold: headColumnBold,
                alignment: headColumnAlign,
                margin: headColumnMargin
              }
              :
              columnSizeArray.length == 3 ? {
                text: headColumnText,
                fontSize: bodyFontSize,
                bold: headColumnBold,
                alignment: headColumnAlign,
                margin: headColumnMargin
              }
              :
              {},
            ] : [],
          ],
          // stack: [
          //  headTable ? {
          //     style: "tableCategoryExample",
          //     margin: headTableMargin,
          //   table: {
          //     widths: headTableWidth,
          //     body: [
          //       ...headTableHead?.map((p: any, i: any) => [
          //         { text: [p.headName], alignment: p.align, bold: p.bold, style: 'tableHeader' },
          //         // { text: ['Category'], alignment: 'center', bold: true, style: 'tableHeader' },
          //         // { text: ['Created By'], alignment: 'center', bold: true, style: 'tableHeader' },
          //         // { text: ['Created Date'], alignment: 'center', bold: true, style: 'tableHeader' }
          //       ]) || [],
          //       // ...this.dataSource.data.map((p: any, i) => [
          //       //   {text: i +1, alignment: 'center' },
          //       //   {text: p.name ? this.dataInitcap(p.name) : '',
          //       //   alignment: 'center',
          //       //   },
          //       //   {text: p.created_by ? this.dataInitcap(p.created_by) : '',
          //       //     alignment: 'center',
          //       //   },
          //       //   {text: p.created_date ? moment(p.created_date).format('DD MMM YYYY') : '', alignment: 'center'}
          //       // ]),
          //     ]
          //   },
          //   layout: {
          //    hLineWidth: function (i:any, node: any) {
          //      return (i === 0 || i === node.table.body.length) ? .25 : .20;
          //    },
          //    vLineWidth: function (i:any, node: any) {
          //      return (i === 0 || i === node.table.widths.length) ? .25 : .20;
          //    },
          //    hLineColor: function (i:any, node: any) {
          //      return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
          //    },
          //    vLineColor: function (i:any, node: any) {
          //      return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
          //    },
          //   }, 
          //   } : {}
          // ]          
        };
      },
      content: [
        [
          {
            style: "tableCategoryExample",
            table: {
              widths: ['10%', '50%', '20%', '20%',],
              body: [
                [
                  { text: ['Srl No.'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Category'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created By'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created Date'], alignment: 'center', bold: true, style: 'tableHeader' }
                ],
                // ...this.dataSource.data.map((p: any, i) => [
                //   {text: i +1, alignment: 'center' },
                //   {text: p.name ? this.dataInitcap(p.name) : '',
                //   alignment: 'center',
                //   },
                //   {text: p.created_by ? this.dataInitcap(p.created_by) : '',
                //     alignment: 'center',
                //   },
                //   {text: p.created_date ? moment(p.created_date).format('DD MMM YYYY') : '', alignment: 'center'}
                // ]),
              ]
            },
            layout: {
             hLineWidth: function (i:any, node: any) {
               return (i === 0 || i === node.table.body.length) ? .25 : .20;
             },
             vLineWidth: function (i:any, node: any) {
               return (i === 0 || i === node.table.widths.length) ? .25 : .20;
             },
             hLineColor: function (i:any, node: any) {
               return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
             },
             vLineColor: function (i:any, node: any) {
               return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
             },
            },
          },
        ]
      ],
      styles: {
        tableCategoryExample: {
          margin: [20, 10, 20, 0],
          fontSize: bodyFontSize,
        },
      tableHeader: {
        fillColor: '#CCCCCC',
        bold: true
      },
      },
      pageMargins: [40, 60, 40, 60],
    };
  
    pdfMake.createPdf(docDefinition).getDataUrl((dataUrl) => {
      const iframe = document.createElement('iframe');
      iframe.style.width = '680px';
      iframe.style.height = '70vh'; // Adjust as needed
      iframe.src = dataUrl;

      const container = document.getElementById('pdfContainer');
      if (container) {
        container.innerHTML = ''; // Clear previous iframe
        container.appendChild(iframe);
      }
    });
  }

  isParam() {
     this.categoryService.getSingleCategory(this.paramId).subscribe(singleData=> {
       if (singleData['isExecuted'] == true) {
         this.autoReportForm.patchValue({ ...singleData.data, updatedBy: this.loginUser, updatedDate : this.currentDate});
       }
       else {
         this.commonService.showErrorMsg(singleData['message']);
       }
     }, (err: any) => {
       this.commonService.showErrorMsg(err.message);
     })
  };

  onSaveConfirmation = (): void => {
    if ((!this.paramId && this.itemArray.length > 0) || (this.paramId && this.autoReportForm.valid)) {
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
        if (this.autoReportForm.value.name == entry['name']) {
          return this.commonService.showErrorMsg('Duplicate Data Found!!!');
        }
      }
    }
    if (this.autoReportForm.valid) {
      this.duplicateSub = this.categoryService.duplicateCheck(this.autoReportForm.value)
        .subscribe((data: any) => {
          if (data['isExecuted'] == false) {
            return this.commonService.showErrorMsg(data['message']);
          } else {
            this.itemArray.push(this.autoReportForm.value);
            // this.categoryForm.get('name')?.setValue(null);
            this.autoReportForm.reset();
            this.autoReportForm.get('createdBy')?.setValue(this.loginUser);
            this.autoReportForm.get('createdDate')?.setValue(this.currentDate);
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
      .updateCategory(this.autoReportForm.value).subscribe(
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

