# Ngx Pendo

An easy implementation pendo on angular6+ apps.

## Install

```
npm install ngx-pendo
```

## Feedbacks

https://github.com/yociduo/ngx-pendo/issues

## Simple Configuration

```ts
import { NgxPendoModule } from 'ngx-pendo';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxPendoModule.forRoot('pendo-api-key')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Call Initialization

```ts
import { Component, OnInit } from '@angular/core';
import { NgxPendoService } from 'ngx-pendo';

@Component( ... )
export class AppComponent implements OnInit {

  constructor(protected ngxPendoService: NgxPendoService) {
  }

  ngOnInit() {
    this.ngxPendoService.initialize({
      id: 'PUT_VISITOR_ID_HERE',
      name: 'Neo',
      email: 'neo@thematrix.io',
      role: 'godlike'
    }, {
      id: 'PUT_ACCOUNT_ID_HERE',
      name: 'CorpSchmorp'
    });
  }

}
```

## Pendo Directives

You can use angular directives to add pendo id.

### Simple directive use

```js
<div ngx-pendo-section="section">
  <button ngx-pendo-id="click_test">Click Test</button>
</div>
```
