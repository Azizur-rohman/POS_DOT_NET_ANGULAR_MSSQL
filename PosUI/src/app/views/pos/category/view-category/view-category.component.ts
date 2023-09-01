import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
pdfMake!.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-category',
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss']
})
export class ViewCategoryComponent {
  subscription?      : Subscription;
  delSub?            : Subscription;
  fetch_data        : any;
  message           : string = '';
  displayedColumns = [
    'index',
    'name', 
    'category_code',
    'created_by',
    'created_date',
    'action'
  ];  
  dataSource =  new MatTableDataSource();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    public  categoryService: CategoryService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
    this.uiInfo();
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  uiInfo() {
    this.commonService.setUiInfo({ 
      title: 'View Category List',
      goBackPath: '/pos/category', 
      refreshPath: '/pos/category/view',
      addNewPath: '/pos/category'
    })
  };

  getCategoryList() {
    // this.asyncService.start();
    this.subscription =
    this.categoryService.getCategoryList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.dataSource.data = getData['data'] ;
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

  updateRecord(element: any) {
    this.router.navigate(['/pos/category', { id: element.id }]);
  };

  deleteCategory(element: any) {
    this.delSub =
    this.categoryService.deleteCategory(element.id).subscribe((res: any) => {
      if (res['isExecuted'] == true) {
        this.commonService.showSuccessMsg(res['message']);
        this.ngOnInit();
      } else {
        this.commonService.showErrorMsg(res['message']);
      }    
      // this.asyncService.finish(); 
    }, (error) => {
      // this.asyncService.finish(); 
      this.commonService.showErrorMsg(error.message);
    }); 
  }; 

  dataInitcap(indexText: any)
  {
    let indexNewText = '';
    if (indexText)
    {
      var splitted = indexText.split(" ", 999); 
      for (let i=0; i<splitted.length; i++)
      {
        if (i!=0)
        {
          indexNewText += ' ';
        }
        indexNewText += this.transform(splitted[i]);
      }
    }
    else
    {
      indexNewText = indexText;
    }

    return indexNewText;
  }

  transform(value:string): string {
    let first = value.substr(0,1).toUpperCase();
    let specialFlag : boolean = false;
    let last = '';
    for (let i=1; i<value.length; i++)
    {
      if (value[i] == '.')
      {
        specialFlag = true;
        last += value[i];
      }
      else
      {
        if (specialFlag)
        {
          last += value[i].toUpperCase();
        }
        else
        {
          last += value[i].toLowerCase();
        }
        specialFlag = false;
      }      
    }

    return first + last; 
  };

  generateReport() {
    var docDefinition: any = {
      header: function () {
        return {
          margin: [40, 20, 0, 0],
          columns:  [
            [
              // {
              //   image: logo.imgBase64,
              //   width: 210,
              //   height: 55,
              //   alignment: 'center',
              //   margin: [0, 5, 20, 5]
              // },
              {
                // text: headerText,
                text: 'Category List',
                fontSize: 20,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 40, 0]
              },
            ] ,
          ],              
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
                ...this.dataSource.data.map((p: any, i) => [
                  {text: i +1, alignment: 'center' },
                  {text: p.name ? this.dataInitcap(p.name) : '',
                  alignment: 'center',
                  },
                  {text: p.created_by ? this.dataInitcap(p.created_by) : '',
                    alignment: 'center',
                  },
                  {text: p.created_date ? moment(p.created_date).format('DD MMM YYYY') : '', alignment: 'center'}
                ]),
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
          fontSize: 10 - 1,
        },
      tableHeader: {
        fillColor: '#CCCCCC',
        bold: true
      },
      },
      pageMargins: [40, 60, 40, 60],
    };
  
    pdfMake.createPdf(docDefinition).open(); // Open the PDF in a new tab
  }

  onDeleteConfirmation = (element: any): void => {
    this.commonService.showDialog(
      {
        title: 'Confirmation - Delete Record',
        content: 'Do you want to delete this record?',
      },
      () => this.deleteCategory(element)
    );
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(){
    if (this.subscription){
        this.subscription.unsubscribe();
    }
    if (this.delSub){
        this.delSub.unsubscribe();
    }
    // this.asyncService.finish();
  };

}

