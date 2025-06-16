import { NgModule, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
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
  providers: [provideZonelessChangeDetection()],
  bootstrap: [AppComponent]
})
export class AppModule {}
