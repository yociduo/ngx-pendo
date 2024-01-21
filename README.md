# Ngx Pendo

An easy implementation pendo on angular6+ apps.

[![NPM version](https://img.shields.io/npm/v/ngx-pendo.svg)](https://www.npmjs.com/package/ngx-pendo)
[![NPM downloads](https://img.shields.io/npm/dm/ngx-pendo.svg?style=flat-square)](https://www.npmjs.com/package/ngx-pendo)
[![Build Status](https://github.com/yociduo/ngx-pendo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/yociduo/ngx-pendo/actions/workflows/ci.yml)
[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yociduo/ngx-pendo/blob/main/LICENSE)

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

#### Using Service

```ts
import { Component, OnInit } from '@angular/core';
import { NgxPendoService } from 'ngx-pendo';

@Component( ... )
export class AppComponent implements OnInit {

  constructor(private ngxPendoService: NgxPendoService) {
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

#### Using Context

```ts
import { Component, OnInit } from '@angular/core';
import { NGX_PENDO_CONTEXT, IPendo } from 'ngx-pendo';

@Component( ... )
export class AppComponent implements OnInit {

  constructor(@Inject(NGX_PENDO_CONTEXT) private pendo: IPendo) {
  }

  ngOnInit() {
    this.pendo.initialize({
      visitor: {
        id: "PUT_VISITOR_ID_HERE",
        name: "John Doe",
        email: "user@acme.com",
        role: "Viewer"
      },
      account: {
        id: "PUT_ACCOUNT_ID_HERE",
        name: "Acme Co"
      },
      apiKey: 'PUT_API_KEY_HERE'
    });
  }

}
```

#### Using Pendo

```ts
import { Component, OnInit } from '@angular/core';
import { IPendo } from 'ngx-pendo';

declare var pendo: IPendo;

@Component( ... )
export class AppComponent implements OnInit {

  ngOnInit() {
    pendo.initialize({
      visitor: {
        id: "PUT_VISITOR_ID_HERE",
        name: "John Doe",
        email: "user@acme.com",
        role: "Viewer"
      },
      account: {
        id: "PUT_ACCOUNT_ID_HERE",
        name: "Acme Co"
      },
      apiKey: 'PUT_API_KEY_HERE'
    });
  }

}
```

## Pendo Directives

You can use angular directives to add pendo id.

### Simple directive use

```html
<div ngx-pendo-section="section">
  <button ngx-pendo-id="click_test">Click Test</button>
</div>
```
