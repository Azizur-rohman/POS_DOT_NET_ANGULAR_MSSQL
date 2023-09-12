import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { StockManagementService } from '../../pos/services/stock-management.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Subscription } from 'rxjs';
import { SaleService } from '../../pos/services/sale.service';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  subscription?       : Subscription;
  delSub?            : Subscription;
  fetch_data        : any;
  saleData        : any;
  message           : string = '';
  productTotalAmount: number = 0;
  saleTotalAmount: number = 0;
  quantityTotalAmount: number = 0;
  grandTotalAmount: number = 0;
  totalSaleAmount: number = 0;
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public stockManagementService: StockManagementService,
    public commonService: CommonService,
    public saleService: SaleService,
  ) {}

  data: any[] = [];
  options: any[] = [];
  labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
    'April'
  ];
  datasets = [
    [{
      label: 'My First dataset',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-primary'),
      pointHoverBorderColor: getStyle('--cui-primary'),
      data: [65, 59, 84, 84, 51, 55, 40]
    }], [{
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-info'),
      pointHoverBorderColor: getStyle('--cui-info'),
      data: [1, 18, 9, 17, 34, 22, 11]
    }], [{
      label: 'My Third dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: getStyle('--cui-warning'),
      pointHoverBorderColor: getStyle('--cui-warning'),
      data: [78, 81, 80, 45, 34, 12, 40],
      fill: true
    }], [{
      label: 'My Fourth dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
      barPercentage: 0.7
    }]
  ];
  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  ngOnInit(): void {
    this.getProductList();
    this.getSaleList();
    this.setData();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();

  }

  getProductList() {
    // this.asyncService.start();
    this.productTotalAmount = 0;
    this.saleTotalAmount = 0;
    this.quantityTotalAmount = 0;
    this.grandTotalAmount = 0;
    this.subscription =
    this.stockManagementService.getProductPurchaseHistoryList().subscribe(getData => {  
      if (getData['isExecuted'] == true) {          
      this.fetch_data = getData['data'] ;
      for( let i=0; i < getData['data'].length; i++)
      {
         this.productTotalAmount += getData['data'][i].purchase_price;
         this.saleTotalAmount += getData['data'][i].sale_price;
         this.quantityTotalAmount += getData['data'][i].quantity;
      }
      this.grandTotalAmount = this.productTotalAmount * this.quantityTotalAmount
      this.getformatPurchase();
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

  getSaleList() {
    // this.asyncService.start();
    this.totalSaleAmount = 0;
    this.subscription =
      this.saleService.getSaleList().subscribe(getData => {
        if (getData['isExecuted'] == true) {
          this.saleData = getData['data'];
          for( let i=0; i < getData['data'].length; i++)
            {
              this.totalSaleAmount += getData['data'][i].grand_total_amount;
            }
          this.getformatSale();
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

  setData() {
    for (let idx = 0; idx < 4; idx++) {
      this.data[idx] = {
        labels: idx < 3 ? this.labels.slice(0, 7) : this.labels,
        datasets: this.datasets[idx]
      };
    }
    this.setOptions();
  }

  getformatPurchase(){
    if(this.grandTotalAmount == 0) {
    return 0;
}
else
{        
  // hundreds
  if(this.grandTotalAmount <= 999){
    return this.grandTotalAmount ;
  }
  // thousands
  else if(this.grandTotalAmount >= 1000 && this.grandTotalAmount <= 999999){
    return (this.grandTotalAmount / 1000) + 'K';
  }
  // millions
  else if(this.grandTotalAmount >= 1000000 && this.grandTotalAmount <= 999999999){
    return (this.grandTotalAmount / 1000000) + 'M';
  }
  // billions
  else if(this.grandTotalAmount >= 1000000000 && this.grandTotalAmount <= 999999999999){
    return (this.grandTotalAmount / 1000000000) + 'B';
  }
  else
    return this.grandTotalAmount ;
  }
}

getformatSale(){
  if(this.totalSaleAmount == 0) {
  return 0;
}
else
{        
// hundreds
if(this.totalSaleAmount <= 999){
  return this.totalSaleAmount ;
}
// thousands
else if(this.totalSaleAmount >= 1000 && this.totalSaleAmount <= 999999){
  return (this.totalSaleAmount / 1000) + 'K';
}
// millions
else if(this.totalSaleAmount >= 1000000 && this.totalSaleAmount <= 999999999){
  return (this.totalSaleAmount / 1000000) + 'M';
}
// billions
else if(this.totalSaleAmount >= 1000000000 && this.totalSaleAmount <= 999999999999){
  return (this.totalSaleAmount / 1000000000) + 'B';
}
else
  return this.totalSaleAmount ;
}
}

  setOptions() {
    for (let idx = 0; idx < 4; idx++) {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      switch (idx) {
        case 0: {
          this.options.push(options);
          break;
        }
        case 1: {
          options.scales.y.min = -9;
          options.scales.y.max = 39;
          this.options.push(options);
          break;
        }
        case 2: {
          options.scales.x = { display: false };
          options.scales.y = { display: false };
          options.elements.line.borderWidth = 2;
          options.elements.point.radius = 0;
          this.options.push(options);
          break;
        }
        case 3: {
          options.scales.x.grid = { display: false, drawTicks: false };
          options.scales.x.grid = { display: false, drawTicks: false, drawBorder: false };
          options.scales.y.min = undefined;
          options.scales.y.max = undefined;
          options.elements = {};
          this.options.push(options);
          break;
        }
      }
    }
  }
}

@Component({
  selector: 'app-chart-sample',
  template: '<c-chart type="line" [data]="data" [options]="options" width="300" #chart></c-chart>'
})
export class ChartSample implements AfterViewInit {

  constructor() {}

  @ViewChild('chart') chartComponent!: ChartjsComponent;

  colors = {
    label: 'My dataset',
    backgroundColor: 'rgba(77,189,116,.2)',
    borderColor: '#4dbd74',
    pointHoverBackgroundColor: '#fff'
  };

  labels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  data = {
    labels: this.labels,
    datasets: [{
      data: [65, 59, 84, 84, 51, 55, 40],
      ...this.colors,
      fill: { value: 65 }
    }]
  };

  options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      const data = () => {
        return {
          ...this.data,
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{
            ...this.data.datasets[0],
            data: [42, 88, 42, 66, 77],
            fill: { value: 55 }
          }, { ...this.data.datasets[0], borderColor: '#ffbd47', data: [88, 42, 66, 77, 42] }]
        };
      };
      const newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const newData = [42, 88, 42, 66, 77];
      let { datasets, labels } = { ...this.data };
      // @ts-ignore
      const before = this.chartComponent?.chart?.data.datasets.length;
      console.log('before', before);
      // console.log('datasets, labels', datasets, labels)
      // @ts-ignore
      // this.data = data()
      this.data = {
        ...this.data,
        datasets: [{ ...this.data.datasets[0], data: newData }, {
          ...this.data.datasets[0],
          borderColor: '#ffbd47',
          data: [88, 42, 66, 77, 42]
        }],
        labels: newLabels
      };
      // console.log('datasets, labels', { datasets, labels } = {...this.data})
      // @ts-ignore
      setTimeout(() => {
        const after = this.chartComponent?.chart?.data.datasets.length;
        console.log('after', after);
      });
    }, 5000);
  }
}
