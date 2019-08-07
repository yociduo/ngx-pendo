import { Injectable } from '@angular/core';
import { IAccount, IVisitor } from './ngx-pendo.interfaces';

declare var pendo: any;

@Injectable({
  providedIn: 'root'
})
export class NgxPendoService {

  constructor() { }

  /**
   * Call initialize
   *
   * @param visitor IVisitor
   * @param account IAccount
   */
  initialize(visitor: IVisitor, account?: IAccount): void {
    pendo.initialize({ visitor, account });
  }

}
