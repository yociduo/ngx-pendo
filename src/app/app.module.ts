import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgxPendoModule } from 'ngx-pendo';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { kebabCase } from './utils';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxPendoModule.forRoot({
      pendoApiKey: 'pendo-api-key',
      pendoIdFormatter: kebabCase
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
