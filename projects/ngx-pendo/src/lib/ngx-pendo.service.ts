import { Injectable, inject } from '@angular/core';
import { NGX_PENDO_CONTEXT, NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { IAccount, IPendoOptions, IVisitor } from './ngx-pendo.interfaces';

@Injectable({
  providedIn: 'root'
})
export class NgxPendoService {
  private pendo = inject(NGX_PENDO_CONTEXT);
  private pendoIdFormatter = inject(NGX_PENDO_SETTINGS_TOKEN).pendoIdFormatter;

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
      this.pendo?.initialize({ visitor: optionsOrVisitor, account });
    } else {
      this.pendo?.initialize(optionsOrVisitor);
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
      this.pendo?.identify(visitor, account);
    } else {
      this.pendo?.identify({ visitor: visitor as IVisitor, account: account as IAccount });
    }
  }

  /**
   * Updates metadata object for the Pendo agent.
   *
   * @param options IPendoOptions
   */
  updateOptions(options: IPendoOptions): void {
    this.pendo?.updateOptions(options);
  }

  /**
   * Format Pendo
   *
   * @param ids string[]
   */
  formatPendoId(...ids: string[]): string {
    return (this.pendoIdFormatter ? ids.map(id => this.pendoIdFormatter!(id)) : ids).join('.');
  }

  /**
   * Shuts down the agent and cleans up all timers and listeners.
   */
  teardown(): void {
    this.pendo?.teardown();
  }

  /**
   * Checks if a given visitor id string is anonymous.
   * If no argument is given, calls with pendo.getVisitorId() to check current visitor status.
   */
  isAnonymousVisitor(visitorId?: string): boolean {
    return this.pendo?.isAnonymousVisitor(visitorId);
  }

  /**
   * Removes current visitor id and account id.
   * Triggers an identify event and reloads with a new anonymous visitor.
   */
  clearSession(): void {
    this.pendo?.clearSession();
  }

  /**
   * Loads Pendo Debugger and extends the global pendo object with additional functionality for debugging purposes.
   */
  enableDebugging(): void {
    this.pendo?.enableDebugging();
  }

  /**
   * Removes Pendo Debugger extension.
   */
  disableDebugging(): void {
    this.pendo?.disableDebugging();
  }

  /**
   * Method to manually track events. Requires a non-empty name string to collect event.
   */
  track(trackType: string, metadata?: Record<string, string | number | boolean | string[] | null>): void {
    this.pendo?.track(trackType, metadata);
  }
}
