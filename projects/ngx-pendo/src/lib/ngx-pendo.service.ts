import { Injectable, Inject } from '@angular/core';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.injectors';
import { IAccount, IVisitor, IPendoSettings } from './ngx-pendo.interfaces';

declare var pendo: any;

const DEFAULT_PENDO_ID_FORMATTER: (pendoId: string) => string = pendoId => pendoId;

@Injectable()
export class NgxPendoService {

  private pendoIdFormatter: (pendoId: string) => string;

  /**
   * Constructor
   *
   * @param settings IPendoSettings
   */
  constructor(@Inject(NGX_PENDO_SETTINGS_TOKEN) settings: IPendoSettings) {
    this.pendoIdFormatter = settings.pendoIdFormatter || DEFAULT_PENDO_ID_FORMATTER;
  }

  /**
   * Completely re-initialize the Agent with new options
   *
   * @param visitor IVisitor
   * @param account IAccount
   */
  initialize(visitor: IVisitor, account?: IAccount): void {
    pendo.initialize({ visitor, account });
  }

  /**
   * Format Pendo
   *
   * @param ids string[]
   */
  formatPendoId(...ids: string[]): string {
    return (this.pendoIdFormatter ? ids.map(id => this.pendoIdFormatter(id)) : ids).join('.');
  }

}
