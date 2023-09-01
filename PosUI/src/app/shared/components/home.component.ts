import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'home',
  template: `<body class="flexed">
  <div class="flex-1">
              <img
              src="../../../../assets/image/backimage.jpg"
              style="width: 100vw; height: 100vh"
              >
  </div>
  </body>
`
})
export class HomeComponent implements OnInit {
  constructor(private appService: CommonService) {}

  ngOnInit() {
    this.appService.setUiInfo({ title: 'Home', goBackPath: '/calendar', refreshPath: '/' });
  }
}