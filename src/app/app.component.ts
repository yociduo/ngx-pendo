import { Component, Inject, OnInit } from '@angular/core';
import { IAccount, IPendo, IPendoOptions, IVisitor, NGX_PENDO_CONTEXT, NgxPendoService } from 'ngx-pendo';
declare const pendo: IPendo;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'ngx-pendo-demo';
  id = 'variable-id';
  section = 'variable-section';
  list = new Array(1).fill(null);
  visitor: IVisitor = {
    id: '13-package'
  };
  account: IAccount = {
    id: '1-package'
  };

  public get options(): IPendoOptions {
    return { visitor: this.visitor, account: this.account };
  }

  constructor(
    @Inject(NGX_PENDO_CONTEXT) private pendo: IPendo,
    private ngxPendoService: NgxPendoService
  ) {}

  ngOnInit(): void {
    if (this.pendo) {
      this.initializeWithService();
    }
  }

  addItem(): void {
    this.list.push(6);
  }

  removeItem(): void {
    this.list.pop();
  }

  addId(): void {
    this.id += '-id';
  }

  addSection(): void {
    this.section += '-section';
  }

  teardown(): void {
    this.ngxPendoService.teardown();
  }

  identify(): void {
    this.ngxPendoService.identify(this.visitor, this.account);
  }

  enableDebugging(): void {
    this.ngxPendoService.enableDebugging();
  }

  disableDebugging(): void {
    this.ngxPendoService.disableDebugging();
  }

  updateOptions(): void {
    this.ngxPendoService.updateOptions(this.options);
  }

  initializeWithService() {
    this.ngxPendoService.initialize(this.options);
    // previous initialize function
    // this.ngxPendoService.initialize(this.visitor, this.account);
  }

  initializeWithContext() {
    this.pendo.initialize(this.options);
  }

  initializeWithGlobal() {
    pendo.initialize(this.options);
  }
}
