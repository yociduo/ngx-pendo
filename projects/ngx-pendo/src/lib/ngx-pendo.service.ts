// tslint:disable: no-string-literal
import { Injectable, Inject, isDevMode } from '@angular/core';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.injectors';
import { IAccount, IVisitor, IPendoSettings } from './ngx-pendo.interfaces';
import { interval, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

declare var pendo: any;

@Injectable({
  providedIn: 'root'
})
export class NgxPendoService {

  private pendoIdFormatter: (pendoId: string) => string;

  private pendoScriptLoaded$: Observable<any>;

  private pendoScriptLoaded: boolean = null;

  /**
   * Constructor
   *
   * @param settings IPendoSettings
   */
  constructor(@Inject(NGX_PENDO_SETTINGS_TOKEN) settings: IPendoSettings) {
    this.pendoIdFormatter = settings.pendoIdFormatter;
    this.pendoScriptLoaded$ = interval(100).pipe(
      filter(time => time > 6000 || !!window['pendo']), // timeout after 10 mins
      take(1),
      map(() => !!window['pendo']),
      tap(loaded => this.pendoScriptLoaded = loaded)
    );
  }

  /**
   * Call initialize
   *
   * @param visitor IVisitor
   * @param account IAccount
   */
  initialize(visitor: IVisitor, account?: IAccount): void {
    this.runFuncAfterLoaded(() => pendo.initialize({ visitor, account }));
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
   * Run function after loaded
   *
   * @param func () => void
   */
  private runFuncAfterLoaded(func: () => void) {
    if (this.pendoScriptLoaded === true) {
      func();
    } else if (this.pendoScriptLoaded === false) {
      if (isDevMode()) {
        console.error('Failed to load pendo script.');
      }
    } else {
      this.pendoScriptLoaded$.subscribe(() => this.runFuncAfterLoaded(func));
    }
  }

}
