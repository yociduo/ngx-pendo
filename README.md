# Ngx Pendo

An easy implementation pendo on angular6+ apps.

[![npm version](https://img.shields.io/npm/v/ngx-pendo.svg)](https://www.npmjs.com/package/ngx-pendo)
[![Build Status](https://travis-ci.org/yociduo/ngx-pendo.svg?branch=master)](https://travis-ci.org/yociduo/ngx-pendo)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yociduo/ngx-pendo/blob/master/LICENSE)

## Install

### npm

If you use npm:

```
npm install ngx-pendo
```

### yarn

If you use yarn:

```
yarn add ngx-pendo
```

### schematics

Use the Angular CLI's install [schematics](https://angular.io/guide/schematics) to set up [ngx-pendo](https://www.npmjs.com/package/ngx-pendo) by running the following command:

```
ng add ngx-pendo
```

The `ng add` command will install [ngx-pendo](https://www.npmjs.com/package/ngx-pendo) and ask you the following question:

1. Please enter Pendo Api Key: <br/> You must enter Pendo Api Key

The `ng add` command will additionally perform the following configurations:

* Add `ngx-pendo` to *package.json*
* Auto import `NgxPendoModule` with *pendoApiKey* into `AppModule`


> This feature need angular 11+.

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
    NgxPendoModule.forRoot({
      pendoApiKey: 'pendo-api-key',
      pendoIdFormatter: (value: any) => value.toString().toLowerCase()
    })
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
