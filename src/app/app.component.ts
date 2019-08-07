import { Component, OnInit } from '@angular/core';
import { NgxPendoService } from 'ngx-pendo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngx-pendo-demo';

  constructor(private ngxPendoService: NgxPendoService) {
  }

  ngOnInit() {
    this.ngxPendoService.initialize({
      id: '13-package'
    }, {
      id: '1-package'
    });
  }
}
