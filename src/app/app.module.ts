import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { param } from 'change-case';

import { NgxPendoModule } from 'ngx-pendo';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NgxPendoModule.forRoot({
      pendoApiKey: environment.pendoApiKey,
      pendoIdFormatter: param,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
