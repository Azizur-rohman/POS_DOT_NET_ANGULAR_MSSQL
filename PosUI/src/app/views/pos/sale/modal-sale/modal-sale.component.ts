import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AsyncService } from 'src/app/shared/services/async.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as moment from 'moment';
import { SaleService } from '../../services/sale.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-sale',
  templateUrl: './modal-sale.component.html',
  styleUrls: ['./modal-sale.component.scss']
})
export class ModalSaleComponent {

  subscription?      : Subscription;
  delSub?            : Subscription;
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  fetch_data        : any;
  message           : string = '';
  order_no: string = '';
  displayedColumns = [
    'index',
    'product_name', 
    'category_name',
    'sale_price',
    'quantity',
    'sub_total_amount'
  ];  
  dataSource =  new MatTableDataSource();
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public commonService: CommonService,
    // public asyncService: AsyncService,
    private router: Router,
    public  saleService: SaleService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.order_no = this.data;
    this.getSaleDetailList();
  };

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSaleDetailList() {
    // this.asyncService.start();
    this.subscription =
    this.saleService.getSaleDetailList(this.order_no).subscribe(getData => {  
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


