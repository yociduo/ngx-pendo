import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPendoModule } from 'ngx-pendo';

import { TestModuleARoutingModule } from './test-module-a-routing.module';
import { TestPageAComponent } from './test-page-a/test-page-a.component';


@NgModule({
  declarations: [TestPageAComponent],
  imports: [
    CommonModule,
    TestModuleARoutingModule,
    NgxPendoModule.forChild(),
  ]
})
export class TestModuleAModule { }
