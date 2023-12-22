import { IPendo } from './ngx-pendo.interfaces';

export type PendoWindow = Window & {
  pendo?: IPendo;
};
