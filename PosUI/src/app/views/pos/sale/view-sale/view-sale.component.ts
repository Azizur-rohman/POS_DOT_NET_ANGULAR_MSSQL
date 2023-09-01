import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import { SaleService } from '../../services/sale.service';
import { ModalSaleComponent } from '../modal-sale/modal-sale.component';
import { MatDialog } from '@angular/material/dialog';
pdfMake!.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.scss']
})
export class ViewSaleComponent {

  subscription?      : Subscription;
  delSub?            : Subscription;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  fetch_data        : any;
  message           : string = '';
  totalAmount: number = 0;
  displayedColumns = [
    'index',
    'order_no', 
    'customer_name',
    'customer_phone',
    'customer_address',
    'created_date',
    'view',
    'action'
  ];  
  dataSource =  new MatTableDataSource();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    public  saleService: SaleService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getSaleList();
    this.uiInfo();
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  uiInfo() {
    this.commonService.setUiInfo({ 
      title: 'View Sale List',
      goBackPath: '/pos/sale', 
      refreshPath: '/pos/sale/view',
      addNewPath: '/pos/sale'
    })
  };

  getSaleList() {
    // this.asyncService.start();
    this.totalAmount = 0;
    this.subscription =
    this.saleService.getSaleList().subscribe(getData => {  
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

  viewReports(data: any) {
    let dialogRef = this.dialog.open(ModalSaleComponent, {
      disableClose: false,
      data: data
    });
  }

  updateRecord(element: any) {
    this.router.navigate(['/pos/sale', { id: element.id }]);
  };

  deleteSale(element: any) {
    this.delSub =
    this.saleService.deleteSale(element.id).subscribe((res: any) => {
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
    let currentDate = this.currentDate;
    var docDefinition: any = {
      pageMargins: [40, 60, 40, 60],
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
                stack:[
                  
                  {
                    // text: headerText,
                    text: 'Product List',
                    fontSize: 20,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 40, 0]
                  },
                  {
                      text: moment(currentDate).format("DD MMM yyyy"),
                      fontSize: 9,
                      alignment: 'right',
                      margin: [0, 0, 60, 0]
                  }
                ]
              }
            ],
          ],              
        };
      },
      footer: function (currentPage: any, pageCount: any) {
        return{
          columns:[
            [
              {
                alignment: 'center',
                fontSize: 9,
                stack:[
                  {text: '[' + currentPage.toString().padStart(2, '0') + ' of ' + pageCount.toString().padStart(2, '0') + ']'}
                ]
              }
            ]
          ]
        }
      },
      content: [
        [
          {
            style: "tableProductExample",
            table: {
              widths: ['8%', '25%', '12%', '15%', '10%', '15%', '15%'],
              body: [
                [
                  { text: ['Srl No.'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Product'], alignment: 'left', bold: true, style: 'tableHeader' },
                  { text: ['Category'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Image'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Price'], alignment: 'right', bold: true, style: 'tableHeader' },
                  { text: ['Created By'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created Date'], alignment: 'center', bold: true, style: 'tableHeader' }
                ],
                ...this.dataSource.data.map((p: any, i) => [
                  {text: i +1 ,alignment: 'center',},
                  {text: p.name ? p.name : '',
                  alignment: 'left',
                  },
                  {text: p.category ? p.category : '',
                  alignment: 'center',
                  },
                  {image: p.image ? p.image : '', height: 30, width: 40,
                  alignment: 'center',
                  },
                  {text: p.price ? this.numberWithCommas(p.price) : '',
                  alignment: 'right',
                  },
                  {text: p.created_by ? this.dataInitcap(p.created_by) : '',
                    alignment: 'center',
                  },
                  {text: p.created_date ?  moment(p.created_date).format('DD MMM YYYY') : '', alignment: 'center',}
                ]),
                [
                  {text: 'Total:', bold: true, colSpan: 4},
                  {},
                  {},
                  {},
                  {text: this.totalAmount ? this.numberWithCommas(this.totalAmount) : '', bold: true, alignment: 'right'},
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
    };
  
    pdfMake.createPdf(docDefinition).open(); // Open the PDF in a new tab
  }

  onDeleteConfirmation = (element: any): void => {
    this.commonService.showDialog(
      {
        title: 'Confirmation - Delete Record',
        content: 'Do you want to delete this record?',
      },
      () => this.deleteSale(element)
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


