import { Component, OnInit } from '@angular/core';
import { NgxPendoService } from 'ngx-pendo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngx-pendo-demo';
  id = 'variable-id';
  section = 'variable-section';
  list = new Array(5).fill(null);

  constructor(private ngxPendoService: NgxPendoService) {
  }

  ngOnInit() {
    this.ngxPendoService.initialize({
      id: '13-package'
    }, {
      id: '1-package'
    });
  }

  addItem() {
    this.list.push(6);
  }

  removeItem() {
    this.list.pop();
  }
}
