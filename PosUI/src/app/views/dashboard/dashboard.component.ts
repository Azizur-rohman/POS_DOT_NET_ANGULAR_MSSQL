import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { CommonService } from 'src/app/shared/services/common.service';
import { UserRoleService } from 'src/app/views/pos/services/user-role.service';
import { UserEntryService } from 'src/app/views/pos/services/user-entry.service';
import * as moment from 'moment';
const user = require('src/assets/images/empty-user.js');

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  userData: any = [];
  imageSrc: string = ''
  currentDate: any = moment().format('YYYY-MM-DDThh:mm:ssZ');
  day: any;
  date: any;
  firstDate: any;
  lastDate: any;
  constructor(
    private chartsData: DashboardChartsData,
    public commonService: CommonService,
    public userEntryService: UserEntryService,
    ) {
  }

  // public users: IUser[] = [
  //   {
  //     name: 'Yiorgos Avraamu',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'Us',
  //     usage: 50,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Mastercard',
  //     activity: '10 sec ago',
  //     avatar: './assets/img/avatars/1.jpg',
  //     status: 'success',
  //     color: 'success'
  //   },
  //   {
  //     name: 'Avram Tarasios',
  //     state: 'Recurring ',
  //     registered: 'Jan 1, 2021',
  //     country: 'Bd',
  //     usage: 10,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Visa',
  //     activity: '5 minutes ago',
  //     avatar: './assets/img/avatars/2.jpg',
  //     status: 'danger',
  //     color: 'info'
  //   },
  //   {
  //     name: 'Quintin Ed',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'In',
  //     usage: 74,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Stripe',
  //     activity: '1 hour ago',
  //     avatar: './assets/img/avatars/3.jpg',
  //     status: 'warning',
  //     color: 'warning'
  //   },
  //   {
  //     name: 'Enéas Kwadwo',
  //     state: 'Sleep',
  //     registered: 'Jan 1, 2021',
  //     country: 'Fr',
  //     usage: 98,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Paypal',
  //     activity: 'Last month',
  //     avatar: './assets/img/avatars/4.jpg',
  //     status: 'secondary',
  //     color: 'danger'
  //   },
  //   {
  //     name: 'Agapetus Tadeáš',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'Es',
  //     usage: 22,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'ApplePay',
  //     activity: 'Last week',
  //     avatar: './assets/img/avatars/5.jpg',
  //     status: 'success',
  //     color: 'primary'
  //   },
  //   {
  //     name: 'Friderik Dávid',
  //     state: 'New',
  //     registered: 'Jan 1, 2021',
  //     country: 'Pl',
  //     usage: 43,
  //     period: 'Jun 11, 2021 - Jul 10, 2021',
  //     payment: 'Amex',
  //     activity: 'Yesterday',
  //     avatar: './assets/img/avatars/6.jpg',
  //     status: 'info',
  //     color: 'dark'
  //   }
  // ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    this.dateFromdateTo();
    this.initCharts();
    this.getUserRoleList();
    this.uiInfo();
  }

  uiInfo() {
    this.commonService.setUiInfo({
      title: 'Dashboard',
      refreshPath: '/dashboard',
    });
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }

  dateFromdateTo()
  {
    let numDay = new Date();
    this.day = numDay.setDate(numDay.getDate());
    const currentDate = new Date();
    let first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.firstDate = moment(first).format("MMM DD, yyyy");
    this.lastDate = moment(last).format("MMM DD, yyyy");
  }

  getUserRoleList() {
    this.userEntryService.getUserList().subscribe(getData => {  
        if (getData['isExecuted'] == true) {
          for(let i = 0; i < getData['data'].length; i++) 
          {
            let numDate = new Date(getData['data'][i].created_date);
            this.date = numDate.setDate(numDate.getDate() + 5);
            this.userData.push({
              userId: getData['data'][i].userId, name: getData['data'][i].name, userCategory: getData['data'][i].userCategory,
              image: getData['data'][i].image, country: 'Bd', color: 'primary', date: this.date, usage: 43, address: getData['data'][i].address, phoneNo: getData['data'][i].phoneNo,
              created_date: getData['data'][i].created_date,
            })
          }
        this.imageSrc = user.imgBase64;
        }
      });
  };
}
