// tslint:disable: no-string-literal
import { Injectable, Inject } from '@angular/core';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.injectors';
import { IAccount, IVisitor, IPendoSettings } from './ngx-pendo.interfaces';
import { interval, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

declare var pendo: any;

@Injectable({
  providedIn: 'root'
})
export class NgxPendoService {

  public pendoScriptLoaded$: Observable<any>;

  private pendoIdFormatter: (pendoId: string) => string;

  /**
   * Constructor
   *
   * @param settings IPendoSettings
   */
  constructor(@Inject(NGX_PENDO_SETTINGS_TOKEN) settings: IPendoSettings) {
    this.pendoIdFormatter = settings.pendoIdFormatter;
    this.pendoScriptLoaded$ = interval(100).pipe(
      filter(() => !!window['pendo']),
      take(1),
    );
  }

  /**
   * Completely re-initialize the Agent with new options
   *
   * @param visitor IVisitor
   * @param account IAccount
   */
  initialize(visitor: IVisitor, account?: IAccount): Observable<void> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.initialize({ visitor, account })));
  }

  /**
   * Send an identify event and a meta event.
   *
   * @param visitor string
   * @param account string
   */
  identify(visitor: string, account?: string): Observable<void>;

  /**
   * Send an identify event and a meta event.
   *
   * @param visitor IVisitor | string
   * @param account IAccount | string
   */
  identify(visitor: IVisitor | string, account?: IAccount | string): Observable<void> {
    return this.pendoScriptLoaded$.pipe(map(() => {
      if (typeof visitor === 'string') {
        return pendo.identify(visitor, account);
      } else {
        return pendo.identify({ visitor, account });
      }
    }));
  }

  /**
   * Returns true when the Agent is fully loaded and has an API key.
   */
  isReady(): Observable<boolean> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.isReady()));
  }

  /**
   * Force a flush of cached event objects.
   */
  flushNow(): Observable<any> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.flushNow()));
  }

  /**
   * After initialize has been called, updates one or more visitor metadata fields.
   */
  updateOptions(): Observable<any> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.updateOptions()));
  }

  /**
   * Returns the string for the current Version of the Agent.
   */
  getVersion(): Observable<string> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.getVersion()));
  }

  /**
   * Returns the id for the visitor currently being applied to any events being sent to Pendo.
   */
  getVisitorId(): Observable<string> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.getVisitorId()));
  }

  /**
   * Returns the id for the account currently being applied to any events being sent to Pendo.
   */
  getAccountId(): Observable<string> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.getAccountId()));
  }

  /**
   * Gets the current URL that is sent on all events.
   */
  getCurrentUrl(): Observable<string> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.getCurrentUrl()));
  }

  /**
   * Returns a Guide object for the given name, if loaded.
   *
   * @param name string
   */
  findGuideByName(name: string): Observable<any> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.findGuideByName(name)));
  }

  /**
   * Returns a Guide object for the given id, if loaded.
   *
   * @param id string
   */
  findGuideById(id: string): Observable<any> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.findGuideById(id)));
  }

  /**
   * Returns a Guide object for the given name, if loaded.
   *
   * @param name string
   */
  showGuideByName(name: string): Observable<any> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.showGuideByName(name)));
  }

  /**
   * Returns a Guide object for the given id, if loaded.
   *
   * @param id string
   */
  showGuideById(id: string): Observable<any> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.showGuideById(id)));
  }

  /**
   * Causes the Guide Center to toggle visibility, if the Guide Center is eligible for the current URL.
   */
  toggleLauncher(): Observable<string> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.toggleLauncher()));
  }

  /**
   * Removes the Guide Center completely until a full page reload.
   */
  removeLauncher(): Observable<string> {
    return this.pendoScriptLoaded$.pipe(map(() => pendo.toggleLauncher()));
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
