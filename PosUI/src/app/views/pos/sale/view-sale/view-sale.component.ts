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

  subscription?: Subscription;
  delSub?: Subscription;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  fetch_data: any;
  message: string = '';
  totalAmount: number = 0;
  ar_customerorderdetail: any = [];
  customerorderdetail: any = [];
  customerDetails: any = [];
  singleCustomerOrder: any = [];
  displayedColumns = [
    'index',
    'order_no',
    'customer_name',
    'customer_phone',
    'customer_address',
    'total_amount',
    'discount',
    'vat',
    'grand_total_amount',
    'created_date',
    'view',
    'report',
    'action'
  ];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    public saleService: SaleService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getSaleList();
    this.getCustomerOrderDetails();
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
          this.dataSource.data = getData['data'];
          this.customerDetails = getData['data'];
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

  viewDetails(data: any) {
    let dialogRef = this.dialog.open(ModalSaleComponent, {
      disableClose: false,
      data: data
    });
  }

  viewReports(data: any) {
    this.singleCustomerOrder.splice(0);
    for(let i = 0; i < this.customerDetails.length; i++)
    {
      if(this,this.customerDetails[i].order_no == data)
      {
        this.singleCustomerOrder.push(this.customerDetails[i]);
        this.generateReportSingleCustomer();
      }
    };
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

  dataInitcap(indexText: any) {
    let indexNewText = '';
    if (indexText) {
      var splitted = indexText.split(" ", 999);
      for (let i = 0; i < splitted.length; i++) {
        if (i != 0) {
          indexNewText += ' ';
        }
        indexNewText += this.transform(splitted[i]);
      }
    }
    else {
      indexNewText = indexText;
    }

    return indexNewText;
  }

  transform(value: string): string {
    let first = value.substr(0, 1).toUpperCase();
    let specialFlag: boolean = false;
    let last = '';
    for (let i = 1; i < value.length; i++) {
      if (value[i] == '.') {
        specialFlag = true;
        last += value[i];
      }
      else {
        if (specialFlag) {
          last += value[i].toUpperCase();
        }
        else {
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

 getCustomerOrderDetails() {
    // this.asyncService.start();
    this.subscription =
    this.saleService.getOrderDetailList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.customerorderdetail = getData['data'] ;
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

  get_CustomerOrderDetailsData(orderNo: any){
    this.ar_customerorderdetail.splice(0);
    for(let j=0;j<this.customerorderdetail.length;j++)
    {
      if (this.customerorderdetail[j].order_no === orderNo)
      {
        this.ar_customerorderdetail.push(this.customerorderdetail[j]);
      }
    }
  }

  //start all customer report

 async generateReport() {
  this.ar_customerorderdetail.splice(0);
    let currentDate = this.currentDate;
    let headerFontSize = 9;
    let hedingFontSize = 20
    let bodyFontSize = 9
    var docDefinition: any = {
      pageMargins: [40, 60, 40, 60],
      header: function () {
        return {
          margin: [40, 20, 0, 0],
          columns: [
            [
              // {
              //   image: logo.imgBase64,
              //   width: 210,
              //   height: 55,
              //   alignment: 'center',
              //   margin: [0, 5, 20, 5]
              // },
              {
                stack: [

                  {
                    // text: headerText,
                    text: 'Order List',
                    fontSize: hedingFontSize,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 40, 0]
                  },
                  {
                    text: moment(currentDate).format("DD MMM yyyy"),
                    fontSize: bodyFontSize,
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
        return {
          columns: [
            [
              {
                alignment: 'center',
                fontSize: bodyFontSize,
                stack: [
                  { text: '[' + currentPage.toString().padStart(2, '0') + ' of ' + pageCount.toString().padStart(2, '0') + ']' }
                ]
              }
            ]
          ]
        }
      },
      content: [
        ...this.customerDetails.map((p: any, i: any) => [
          {
            style: 'tableSaleExample',
            table: {
              widths: ['100%'],
              body: [
                [
                  {
                    text:
                      [
                        { text: 'Order No.: #', bold: true },
                        { text: p.order_no, bold: true }
                      ],
                    fontSize: bodyFontSize + 2
                  }
                ],
                [
                  {
                    stack:
                      [
                        { text: 'Customer Details', bold: true, alignment: 'center', decoration: 'underline' }
                      ],
                    fontSize: bodyFontSize + 1,
                    margin: [0, 10, 0, 0]
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
          {
            text: [
             {text: this.get_CustomerOrderDetailsData(p.order_no)}],
          },
          {
            style: 'tableSaleExample',
            table: {
              widths: ['33.33%', '33.33%', '33.33%'],
              body: [
                [
                  {
                    style: "tableProductExample",
                    table: {
                      widths: ['30%', '70%'],
                      body: [
                        [
                          {text: 'Name: ', bold: true, fillColor: '#B9B9B9'},
                          {text: p.customer_name}
                        ]
                      ]
                    },
                    layout: {
                      hLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? .25 : .20;
                      },
                      vLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                      },
                      hLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                      },
                      vLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                      },
                    },
                  },
                  {
                    style: "tableProductExample",
                    table: {
                      widths: ['40%', '60%'],
                      body: [
                        [
                          {text: 'Phone No.: ', bold: true, fillColor: '#B9B9B9'},
                          {text: p.customer_phone}
                        ]
                      ]
                    },
                    layout: {
                      hLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? .25 : .20;
                      },
                      vLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                      },
                      hLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                      },
                      vLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                      },
                    },
                  },
                  {
                    style: "tableProductExample",
                    table: {
                      widths: ['30%', '70%'],
                      body: [
                        [
                          {text: 'Address: ', bold: true, fillColor: '#B9B9B9'},
                          {text: p.customer_address}
                        ]
                      ]
                    },
                    layout: {
                      hLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? .25 : .20;
                      },
                      vLineWidth: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                      },
                      hLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                      },
                      vLineColor: function (i: any, node: any) {
                        return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                      },
                    },
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
          {
            style: 'tableSaleExample',
            table: {
              widths: ['100%'],
              body: [
                [
                  {
                    stack:
                      [
                        { text: 'Order Details', bold: true, alignment: 'center', decoration: 'underline' }
                      ],
                    fontSize: bodyFontSize + 1,
                    margin: [0, 10, 0, 0]
                  }
                ],
              ]
            },
            layout: 'noBorders'
          },
          {
            style: 'tableSaleExample',
            table: {
              widths: ['10%', '20%', '20%', '20%', '10%', '10%', '10%'],
              body: [
                [
                  {text: 'Srl #', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                  {text: 'Product', fillColor: '#B9B9B9', alignment: 'left', bold: true},
                  {text: 'Category', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                  {text: 'Image', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                  {text: 'Price', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                  {text: 'Quantity', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                  {text: 'Sub Total', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                ],
                ...this.ar_customerorderdetail.map((q: any, j: any) =>[
                  {text: j+1, alignment: 'center'},
                  {text: q.product_name, alignment: 'left'},
                  {text: q.category_name, alignment: 'center'},
                  {image: q.image ? q.image : '', width: 40,
                  height: 40, alignment: 'center'},
                  {text: q.sale_price, alignment: 'right'},
                  {text: q.quantity, alignment: 'center'},
                  {text: q.sub_total_amount, alignment: 'right'},
                ]),
                [
                  {text: 'Total: ', alignment: 'right', colSpan: 6, bold: true},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {text: p.total_amount ? p.total_amount : '', bold: true, alignment: 'right'},
                ],
                [
                  {text: 'Discount: ', alignment: 'right', colSpan: 6, bold: true},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {text: p.discount ? p.discount + '%' : '', bold: true, alignment: 'right'},
                ],
                [
                  {text: 'Vat: ', alignment: 'right', colSpan: 6, bold: true},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {text: p.vat ? p.vat + '%' : '', bold: true, alignment: 'right'},
                ],
                [
                  {text: 'Grant Total: ', alignment: 'right', colSpan: 6, bold: true},
                  {},
                  {},
                  {},
                  {},
                  {},
                  {text: p.grand_total_amount ? p.grand_total_amount : '', bold: true, alignment: 'right'},
                ]
              ]
            },
            layout: {
              hLineWidth: function (i: any, node: any) {
                return (i === 0 || i === node.table.body.length) ? .25 : .20;
              },
              vLineWidth: function (i: any, node: any) {
                return (i === 0 || i === node.table.widths.length) ? .25 : .20;
              },
              hLineColor: function (i: any, node: any) {
                return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
              },
              vLineColor: function (i: any, node: any) {
                return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
              },
            },
            pageBreak: i != (this.customerDetails.length-1) ? "after" : null,
          }
        ])
      ],
      styles: {
        tableSaleExample: {
          margin: [20, 10, 20, 0],
          fontSize: bodyFontSize,
        },
        tableHeader: {
          fillColor: '#CCCCCC',
          bold: true
        },
      },
    };

    pdfMake.createPdf(docDefinition).open(); // Open the PDF in a new tab
  }
 
  //end all customer report

  //Single Customer Report

  async generateReportSingleCustomer() {
    this.ar_customerorderdetail.splice(0);
      let currentDate = this.currentDate;
      let headerFontSize = 9;
      let hedingFontSize = 20
      let bodyFontSize = 9
      var docDefinition: any = {
        pageMargins: [40, 60, 40, 60],
        header: function () {
          return {
            margin: [40, 20, 0, 0],
            columns: [
              [
                // {
                //   image: logo.imgBase64,
                //   width: 210,
                //   height: 55,
                //   alignment: 'center',
                //   margin: [0, 5, 20, 5]
                // },
                {
                  stack: [
  
                    {
                      // text: headerText,
                      text: 'Order List',
                      fontSize: hedingFontSize,
                      bold: true,
                      alignment: 'center',
                      margin: [0, 0, 40, 0]
                    },
                    {
                      text: moment(currentDate).format("DD MMM yyyy"),
                      fontSize: bodyFontSize,
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
          return {
            columns: [
              [
                {
                  alignment: 'center',
                  fontSize: bodyFontSize,
                  stack: [
                    { text: '[' + currentPage.toString().padStart(2, '0') + ' of ' + pageCount.toString().padStart(2, '0') + ']' }
                  ]
                }
              ]
            ]
          }
        },
        content: [
          ...this.singleCustomerOrder.map((p: any, i: any) => [
            {
              style: 'tableSaleExample',
              table: {
                widths: ['100%'],
                body: [
                  [
                    {
                      text:
                        [
                          { text: 'Order No.: #', bold: true },
                          { text: p.order_no, bold: true }
                        ],
                      fontSize: bodyFontSize + 2
                    }
                  ],
                  [
                    {
                      stack:
                        [
                          { text: 'Customer Details', bold: true, alignment: 'center', decoration: 'underline' }
                        ],
                      fontSize: bodyFontSize + 1,
                      margin: [0, 10, 0, 0]
                    }
                  ],
                ]
              },
              layout: 'noBorders'
            },
            {
              text: [
               {text: this.get_CustomerOrderDetailsData(p.order_no)}],
            },
            {
              style: 'tableSaleExample',
              table: {
                widths: ['33.33%', '33.33%', '33.33%'],
                body: [
                  [
                    {
                      style: "tableProductExample",
                      table: {
                        widths: ['30%', '70%'],
                        body: [
                          [
                            {text: 'Name: ', bold: true, fillColor: '#B9B9B9'},
                            {text: p.customer_name}
                          ]
                        ]
                      },
                      layout: {
                        hLineWidth: function (i: any, node: any) {
                          return (i === 0 || i === node.table.body.length) ? .25 : .20;
                        },
                        vLineWidth: function (i: any, node: any) {
                          return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                        },
                        hLineColor: function (i: any, node: any) {
                          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                        },
                        vLineColor: function (i: any, node: any) {
                          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                        },
                      },
                    },
                    {
                      style: "tableProductExample",
                      table: {
                        widths: ['40%', '60%'],
                        body: [
                          [
                            {text: 'Phone No.: ', bold: true, fillColor: '#B9B9B9'},
                            {text: p.customer_phone}
                          ]
                        ]
                      },
                      layout: {
                        hLineWidth: function (i: any, node: any) {
                          return (i === 0 || i === node.table.body.length) ? .25 : .20;
                        },
                        vLineWidth: function (i: any, node: any) {
                          return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                        },
                        hLineColor: function (i: any, node: any) {
                          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                        },
                        vLineColor: function (i: any, node: any) {
                          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                        },
                      },
                    },
                    {
                      style: "tableProductExample",
                      table: {
                        widths: ['30%', '70%'],
                        body: [
                          [
                            {text: 'Address: ', bold: true, fillColor: '#B9B9B9'},
                            {text: p.customer_address}
                          ]
                        ]
                      },
                      layout: {
                        hLineWidth: function (i: any, node: any) {
                          return (i === 0 || i === node.table.body.length) ? .25 : .20;
                        },
                        vLineWidth: function (i: any, node: any) {
                          return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                        },
                        hLineColor: function (i: any, node: any) {
                          return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                        },
                        vLineColor: function (i: any, node: any) {
                          return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                        },
                      },
                    }
                  ],
                ]
              },
              layout: 'noBorders'
            },
            {
              style: 'tableSaleExample',
              table: {
                widths: ['100%'],
                body: [
                  [
                    {
                      stack:
                        [
                          { text: 'Order Details', bold: true, alignment: 'center', decoration: 'underline' }
                        ],
                      fontSize: bodyFontSize + 1,
                      margin: [0, 10, 0, 0]
                    }
                  ],
                ]
              },
              layout: 'noBorders'
            },
            {
              style: 'tableSaleExample',
              table: {
                widths: ['10%', '20%', '20%', '20%', '10%', '10%', '10%'],
                body: [
                  [
                    {text: 'Srl #', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                    {text: 'Product', fillColor: '#B9B9B9', alignment: 'left', bold: true},
                    {text: 'Category', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                    {text: 'Image', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                    {text: 'Price', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                    {text: 'Quantity', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                    {text: 'Sub Total', fillColor: '#B9B9B9', alignment: 'center', bold: true},
                  ],
                  ...this.ar_customerorderdetail.map((q: any, j: any) =>[
                    {text: j+1, alignment: 'center'},
                    {text: q.product_name, alignment: 'left'},
                    {text: q.category_name, alignment: 'center'},
                    {image: q.image ? q.image : '', width: 40,
                    height: 40, alignment: 'center'},
                    {text: q.sale_price, alignment: 'right'},
                    {text: q.quantity, alignment: 'center'},
                    {text: q.sub_total_amount, alignment: 'right'},
                  ]),
                  [
                    {text: 'Total: ', alignment: 'right', colSpan: 6, bold: true},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {text: p.total_amount ? p.total_amount : '', bold: true, alignment: 'right'},
                  ],
                  [
                    {text: 'Discount: ', alignment: 'right', colSpan: 6, bold: true},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {text: p.discount ? p.discount + '%' : '', bold: true, alignment: 'right'},
                  ],
                  [
                    {text: 'Vat: ', alignment: 'right', colSpan: 6, bold: true},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {text: p.vat ? p.vat + '%' : '', bold: true, alignment: 'right'},
                  ],
                  [
                    {text: 'Grant Total: ', alignment: 'right', colSpan: 6, bold: true},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {text: p.grand_total_amount ? p.grand_total_amount : '', bold: true, alignment: 'right'},
                  ]
                ]
              },
              layout: {
                hLineWidth: function (i: any, node: any) {
                  return (i === 0 || i === node.table.body.length) ? .25 : .20;
                },
                vLineWidth: function (i: any, node: any) {
                  return (i === 0 || i === node.table.widths.length) ? .25 : .20;
                },
                hLineColor: function (i: any, node: any) {
                  return (i === 0 || i === node.table.body.length) ? 'black' : 'black';
                },
                vLineColor: function (i: any, node: any) {
                  return (i === 0 || i === node.table.widths.length) ? 'black' : 'black';
                },
              },
              pageBreak: i != (this.singleCustomerOrder.length-1) ? "after" : null,
            }
          ])
        ],
        styles: {
          tableSaleExample: {
            margin: [20, 10, 20, 0],
            fontSize: bodyFontSize,
          },
          tableHeader: {
            fillColor: '#CCCCCC',
            bold: true
          },
        },
      };
  
      pdfMake.createPdf(docDefinition).open(); // Open the PDF in a new tab
    }

    //end single customer report

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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.delSub) {
      this.delSub.unsubscribe();
    }
    // this.asyncService.finish();
  };

}


