import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestPageAComponent } from './test-page-a/test-page-a.component';

const routes: Routes = [
  {
    path: '',
    component: TestPageAComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestModuleARoutingModule {}
