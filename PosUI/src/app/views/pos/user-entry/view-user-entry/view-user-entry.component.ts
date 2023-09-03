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
import { UserEntryService } from '../../services/user-entry.service';
pdfMake!.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-view-user-entry',
  templateUrl: './view-user-entry.component.html',
  styleUrls: ['./view-user-entry.component.scss']
})
export class ViewUserEntryComponent {
  subscription?      : Subscription;
  delSub?            : Subscription;
  fetch_data        : any;
  message           : string = '';
  emptyImage: string= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAACrUlEQVR4nO2YT2sTURTF8+FkSlfdWj+Ai1jQlcQkHQzpTJo0mdAWom1RN1ootoIRg2ijlVptS3OFgn8QQdBSilUr6qxcXLnTVtG0fcVJeMm8c+FskvMewy/nvncnsRgKhYpCTaStjSm7ZxvqUTIQVk0AK8kTvLWYhhbVDITVgQB9ciBSMwBAChcUACQAZJ3HDRJIAMhIIEWwhV9Uz0FVNYMDAU7aVvVqpvfBlYu9P++Mn+RapR+q/GEgTISNMBJWh77STQ5aX7eXbO1t4neYhImwUb4TA6ADgD4S6GhvWbQwASDrTl3HXiLf14b43qVTPJG2gpkqjGQPGTO+rWXNAbh+ayA0uH/1fPaMOQAbN+MtByh7GgNwZznD08N9LYM3ne/jnZWMOQB9OQcbQ7y5kOT39UQoyR6yV7uft+MA+l0mACQAZCSQ9LciWpgAkHWnCZcIASDrThTGGAJA7iZhkCYAZCSQ9LciWpgAkHWnCZcIASDrThTGGAJA7iZhkCYAZCSQ9LciWpgAkHWnCZcIHQ1h44nbcq8xt/CnZZcTWY8fzuWVXvGcz3r88ZkaohEAfzQc9kZLfPpCmeOpMr+pHw7m7aMcx1Ne4B0pF4O1xgOszRQCIPtKOR5/XmkG82XV5bS7C29ftZm82QncXHLZLZY46ewm8KztcbZQ4ts3Ck1e+Uy+E494ZY2slT2MBejvafXucABldKyo9IpHvLJG5QVAAkBGAgktrP2M83EGOgCoO2U+bmEHADtVW0/dYK57NZ9TesUjXlmDOZDa+8NEfpBev5/ja1MjoXTUG0nkAc7P5v/6c+B/NHe9YC7Ad4/dAGIYva7nzAXot1kASADISCDpb0W0MAEgR/4S+VBPBAsg+zcDYXIsgJcHrZdihKwmBsJGCRCFQqFQqNgx6xenztHu7V06BwAAAABJRU5ErkJggg=='
  displayedColumns = [
    'index',
    'userId', 
    'name',
    'userCategory',
    'image',
    'address',
    'phoneNo',
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
    public userEntryService: UserEntryService,
  ) { }

  ngOnInit(): void {
    this.getUserList();
    this.uiInfo();
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  uiInfo() {
    this.commonService.setUiInfo({ 
      title: 'View User List',
      goBackPath: '/pos/user', 
      refreshPath: '/pos/user/view',
      addNewPath: '/pos/user'
    })
  };

  getUserList() {
    // this.asyncService.start();
    this.subscription =
    this.userEntryService.getUserList().subscribe(getData => {  
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
    this.router.navigate(['/pos/user', { id: element.id }]);
  };

  deleteUser(element: any) {
    this.delSub =
    this.userEntryService.deleteUser(element.id).subscribe((res: any) => {
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
                text: 'User List',
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
              widths: ['8%', '10%', '20%', '10%', '24%', '10%', '10%', '8%'],
              body: [
                [
                  { text: ['Srl No.'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['User ID'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Name'], alignment: 'left', bold: true, style: 'tableHeader' },
                  { text: ['User Category'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Address'], alignment: 'left', bold: true, style: 'tableHeader' },
                  { text: ['Phone Number'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created By'], alignment: 'center', bold: true, style: 'tableHeader' },
                  { text: ['Created Date'], alignment: 'center', bold: true, style: 'tableHeader' }
                ],
                ...this.dataSource.data.map((p: any, i) => [
                  {text: i +1, alignment: 'center' },
                  {text: p.userId ? p.userId : '',
                  alignment: 'center',
                  },
                  {text: p.name ? p.name : '',
                  alignment: 'left',
                  },
                  {text: p.userCategory ? p.userCategory : '',
                  alignment: 'center',
                  },
                  {text: p.address ? p.address : '',
                  alignment: 'left',
                  },
                  {text: p.phoneNo ? p.phoneNo : '',
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
      () => this.deleteUser(element)
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


