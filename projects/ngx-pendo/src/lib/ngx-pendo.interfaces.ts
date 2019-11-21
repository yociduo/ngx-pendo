export interface IPendoSettings {
  pendoApiKey: string;
  pendoScriptHost?: string;
  pendoIdFormatter?: (pendoId: string) => string;
}

export interface IVisitor {
  id: string;
  [key: string]: string;
}

export interface IAccount {
  id: string;
  [key: string]: string;
}

export interface IPendoDirective {
  inherit: boolean;
  parent?: IPendoDirective;
}
