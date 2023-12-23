import { Injectable, Inject } from '@angular/core';
import { NGX_PENDO_CONTEXT, NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { IAccount, IPendo, IPendoOptions, IPendoSettings, IVisitor } from './ngx-pendo.interfaces';

const DEFAULT_PENDO_ID_FORMATTER: (pendoId: string) => string = pendoId => pendoId;

@Injectable({
  providedIn: 'root'
})
export class NgxPendoService {
  private pendoIdFormatter: (pendoId: string) => string;

  /**
   * Constructor
   *
   * @param settings IPendoSettings
   */
  constructor(
    @Inject(NGX_PENDO_SETTINGS_TOKEN) settings: IPendoSettings,
    @Inject(NGX_PENDO_CONTEXT) private pendo: IPendo
  ) {
    this.pendoIdFormatter = settings.pendoIdFormatter || DEFAULT_PENDO_ID_FORMATTER;
  }

  /**
   * Completely re-initialize the Agent with new options
   *
   * @param optionsOrVisitor IPendoOptions | IVisitor
   * @param account IAccount
   */
  initialize(options: IPendoOptions): void;
  initialize(visitor: IVisitor, account?: IAccount): void;
  initialize(optionsOrVisitor: IPendoOptions | IVisitor, account?: IAccount): void {
    if ('id' in optionsOrVisitor) {
      this.pendo.initialize({ visitor: optionsOrVisitor, account });
    } else {
      this.pendo.initialize(optionsOrVisitor);
    }
  }

  /**
   * Send an identify event and a meta event.
   *
   * @param visitor IVisitor | string
   * @param account IAccount | string
   */
  identify(visitor: string, account?: string): void;
  identify(visitor: IVisitor, account?: IAccount): void;
  identify(visitor: IVisitor | string, account?: IAccount | string): void {
    if (typeof visitor === 'string' && (!account || typeof account === 'string')) {
      this.pendo.identify(visitor, account);
    } else {
      this.pendo.identify({ visitor: <IVisitor>visitor, account: <IAccount>account });
    }
  }

  /**
   * Updates metadata object for the Pendo agent.
   *
   * @param options IPendoOptions
   */
  updateOptions(options: IPendoOptions): void {
    this.pendo.updateOptions(options);
  }

  /**
   * Format Pendo
   *
   * @param ids string[]
   */
  formatPendoId(...ids: string[]): string {
    return (this.pendoIdFormatter ? ids.map(id => this.pendoIdFormatter(id)) : ids).join('.');
  }

  /**
   * Shuts down the agent and cleans up all timers and listeners.
   */
  teardown(): void {
    this.pendo.teardown();
  }

  /**
   * Loads Pendo Debugger and extends the global pendo object with additional functionality for debugging purposes.
   */
  enableDebugging(): void {
    this.pendo.enableDebugging();
  }

  /**
   * Removes Pendo Debugger extension.
   */
  disableDebugging(): void {
    this.pendo.disableDebugging();
  }
}
