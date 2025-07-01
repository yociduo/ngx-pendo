/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { InputSignal, WritableSignal, Provider } from '@angular/core';

export interface IPendoSettings {
  pendoApiKey: string;
  pendoScriptOrigin?: string;
  pendoIdFormatter?: (pendoId: string) => string;
  pendoInitializerProvider?: Provider;
}

export interface IPendoDirective {
  inherit: InputSignal<boolean>;
  parent: WritableSignal<IPendoDirective | undefined>;
}

// The following interfaces and types are based on the Pendo documentation.
// Please according to the Pendo documentation, here's the link: https://agent.pendo.io/
export interface IVisitor {
  id: string;
  [key: string]: string;
}

export interface IAccount {
  id: string;
  [key: string]: string;
}

export interface IPendoIdentity {
  visitor?: IVisitor;
  account?: IAccount;
}

export interface IPendoOptions extends IPendoIdentity {
  // Core
  additionalApiKeys?: string[];
  annotateUrl?: Function;
  apiKey?: string;
  appAutoOrdering?: string[];
  autoFrameInstall?: boolean;
  contentHost?: string;
  cookieDomain?: string;
  dataHost?: string;
  disableCookies?: boolean;
  disableFeedback?: boolean;
  disablePendo?: boolean;
  disablePersistence?: boolean;
  frameIdentitySync?: boolean;
  ignoreHashRouting?: boolean;
  initializeImmediately?: boolean;
  observeShadowRoots?: boolean;
  leaderKey?: string[];
  localStorageOnly?: boolean;
  preferBroadcastChannel?: boolean;
  preferMutationObserver?: boolean;
  preventUnloadListener?: boolean;
  queryStringWhitelist?: string[] | Function;
  sanitizeUrl?: Function;
  selfHostedAgentUrl?: string;
  sendEventsWithPostOnly?: boolean;
  // Analytics
  allowedText?: string[];
  analytics?: {
    excludeEvents?: string[];
  };
  enableDebugEvents?: boolean;
  eventPropertyMatchParents?: boolean;
  excludeAllText?: boolean;
  excludeNonGuideAnalytics?: boolean;
  syntheticClicks?: {
    elementRemoval?: boolean;
    targetChanged?: boolean;
  };
  // Guides
  disableGlobalCSS?: boolean;
  disableGuidePseudoStyles?: boolean;
  disablePrefetch?: boolean;
  enableDesignerKeyboardShortcut?: boolean;
  enableGuideTimeout?: boolean;
  guideSeenTimeoutLength?: number;
  guideValidation?: boolean;
  guides?: {
    attachPoint?: string | Function;
    delay?: boolean;
    disabled?: boolean;
    globalScripts?: any[];
    timeout?: number;
    tooltip?: {
      arrowSize?: number;
    };
  };
  preventCodeInjection?: boolean;
}

export interface IPendo {
  // Agent
  additionalApiKeys: string[];
  apiKey: string;
  getVersion(): string;
  initialize(options: IPendoOptions): void;
  isReady(): boolean;
  teardown(): void;

  // Classic Guides
  hideLauncher(): void;
  removeLauncher(): void;
  showLauncher(): void;
  toggleLauncher(): void;

  // Debugging
  addDebuggingFunctions(): void;
  disableDebugging(): void;
  disableLogging(): void;
  enableDebugging(): void;
  enableLogging(): void;
  isDebuggingEnabled(): void;
  logPublic(): void;

  // DOM
  dom(input: string): HTMLElement;

  // Events
  attachEvent(element: HTMLElement, evt: string, fn: (event: Event) => void, useCapture?: boolean): void;
  detachEvent(element: HTMLElement, evt: string, fn: (event: Event) => void, useCapture?: boolean): void;
  doNotProcess: string;
  flushNow(force?: boolean): void;
  isSendingEvents(): boolean;
  startSendingEvents(): boolean;
  stopSendingEvents(): boolean;
  stopSendingEvents(): boolean;
  track(trackType: string, metadata?: any): void;

  // TODO: Guides

  // Identity
  clearSession(): void;
  generate_unique_id(prefix?: string): string;
  getAccountId(): string | null;
  get_account_id(): string | null;
  getSerializedMetadata(): any;
  getVisitorId(): string;
  get_visitor_id(): string;
  identify(options: IPendoIdentity | string, accountId?: string): void;
  isAnonymousVisitor(visitorId?: string): boolean;
  set_account_id(newAccountId?: string): void;
  set_visitor_id(newVisitorId?: string): void;
  updateOptions(options: IPendoOptions): void;

  // URL
  url: {
    get: () => string;
  };
  normalizedUrl: string;
  getCurrentUrl: () => string;
  getNormalizedUrl: () => string;
  pageLoad: (url: string) => void;

  // TODO: Utility

  // TODO: Validation
}
