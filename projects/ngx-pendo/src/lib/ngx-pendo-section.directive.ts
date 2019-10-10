import {
  Directive,
  Input,
  HostBinding,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { IPendoDirective } from './ngx-pendo.interfaces';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';

@Directive({
  selector: '[ngx-pendo-section]'
})
export class NgxPendoSectionDirective implements IPendoDirective, AfterContentInit, OnChanges, OnDestroy {

  @Input('ngx-pendo-section')
  @HostBinding('attr.ngx-pendo-section')
  pendoSection: string;

  // tslint:disable-next-line: no-input-rename
  @Input('ngx-pendo-inherit')
  inherit = true;

  @HostBinding('attr.ngx-pendo-disable-inherit')
  get disableInherit() {
    return this.inherit ? undefined : true;
  }

  parent: NgxPendoSectionDirective;

  @ContentChildren(NgxPendoIdDirective, { descendants: false })
  idDirectives !: QueryList<NgxPendoIdDirective>;

  @ContentChildren(NgxPendoSectionDirective, { descendants: false })
  sectionDirectives !: QueryList<NgxPendoSectionDirective>;

  @ContentChildren(NgxPendoIdDirective, { descendants: true })
  allIdDirectives !: QueryList<NgxPendoIdDirective>;

  private subscriptions: Subscription[] = [];

  ngAfterContentInit(): void {
    // set all child parent
    this.subscriptions.push(merge(
      this.sectionDirectives.changes.pipe(startWith(this.sectionDirectives)),
      this.idDirectives.changes.pipe(startWith(this.idDirectives)),
    ).subscribe((items: QueryList<IPendoDirective>) => items.forEach(item => {
      if (item !== this) {
        item.parent = this;
      }
    })));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pendoSection && !changes.pendoSection.firstChange) {
      this.allIdDirectives.forEach(i => i.parent = i.parent);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }

}
