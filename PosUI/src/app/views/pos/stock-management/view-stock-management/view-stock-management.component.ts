import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { StockManagementService } from '../../services/stock-management.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
pdfMake!.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-stock-management',
  templateUrl: './view-stock-management.component.html',
  styleUrls: ['./view-stock-management.component.scss']
})
export class ViewStockManagementComponent {
  subscription?      : Subscription;
  delSub?            : Subscription;
  fetch_data        : any;
  message           : string = '';
  productTotalAmount: number = 0;
  saleTotalAmount: number = 0;
  quantityTotalAmount: number = 0;
  displayedColumns = [
    'index',
    'product', 
    'category',
    'image',
    'product_price',
    'sale_price',
    'quantity',
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
    public  stockManagementService: StockManagementService,
  ) { }

  ngOnInit(): void {
    this.getProductList();
    this.uiInfo();
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  uiInfo() {
    this.commonService.setUiInfo({ 
      title: 'View Stock Management List',
      goBackPath: '/pos/stock-management', 
      refreshPath: '/pos/stock-management/view',
      addNewPath: '/pos/stock-management'
    })
  };

  getProductList() {
    // this.asyncService.start();
    this.productTotalAmount = 0;
    this.saleTotalAmount = 0;
    this.quantityTotalAmount = 0;
    this.subscription =
    this.stockManagementService.getStockManagementList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.dataSource.data = getData['data'] ;
      for( let i=0; i < getData['data'].length; i++)
      {
         this.productTotalAmount += getData['data'][i].product_price;
         this.saleTotalAmount += getData['data'][i].sale_price;
         this.quantityTotalAmount += getData['data'][i].quantity;
      }
      
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
    this.router.navigate(['/pos/stock-management', { id: element.id }]);
  };

  deleteStockManagement(element: any) {
    this.delSub =
    this.stockManagementService.deleteStockManagement(element.id).subscribe((res: any) => {
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

  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
                text: 'Stock Management List',
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
            style: "tableProductExample",
            table: {
              widths: ['8%', '17%', '14%', '10%', '10%', '10%', '10%', '10%', '10%', ],
              body: [
                [
                  { text: ['Srl No.'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Product'], alignment: 'left', bold: true, style: 'tableHeader' },
                  { text: ['Category'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Image'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Product Price'], alignment: 'right', bold: true, style: 'tableHeader' },
                  { text: ['Sale Price'], alignment: 'right', bold: true, style: 'tableHeader' },
                  { text: ['Quantity'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created By'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created Date'], alignment: 'center', bold: true, style: 'tableHeader' }
                ],
                ...this.dataSource.data.map((p: any, i) => [
                  {text: i +1 ,alignment: 'center',},
                  {text: p.product ? p.product : '',
                  alignment: 'left',
                  },
                  {text: p.category ? p.category : '',
                  alignment: 'center',
                  },
                  {image: p.image ? p.image : '', height: 30, width: 40,
                  alignment: 'center',
                  },
                  {text: p.product_price ? this.numberWithCommas(p.product_price) : '',
                  alignment: 'right',
                  },
                  {text: p.sale_price ? this.numberWithCommas(p.sale_price) : '',
                  alignment: 'right',
                  },
                  {text: p.quantity ? this.numberWithCommas(p.quantity) : '',
                  alignment: 'center',
                  },
                  {text: p.created_by ? p.created_by : '',
                    alignment: 'center',
                  },
                  {text: p.created_date ?  moment(p.created_date).format('DD MMM YYYY') : '', alignment: 'center',}
                ]),
                [
                  {text: 'Total:', bold: true, colSpan: 4},
                  {},
                  {},
                  {},
                  {text: this.productTotalAmount ? this.numberWithCommas(this.productTotalAmount) : '', bold: true, alignment: 'right'},
                  {text: this.saleTotalAmount ? this.numberWithCommas(this.saleTotalAmount) : '', bold: true, alignment: 'right'},
                  {text: this.quantityTotalAmount ? this.numberWithCommas(this.quantityTotalAmount) : '', bold: true, alignment: 'center'},
                  {text: '',colSpan:2},
                  {},
                ],
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
      //   // tableExample: {
      //   //   margin: [0, 5, 0, 0],
      //   //   fontSize: this.bodyFontSize,
      //   // },
        tableProductExample: {
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
      () => this.deleteStockManagement(element)
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
