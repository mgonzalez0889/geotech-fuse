/* eslint-disable eol-last */
/* eslint-disable @typescript-eslint/naming-convention */
export interface IBodyHistoric {
  date_init: Date;
  date_end: Date;
  plates: number[];
  avents: number[];
  fleets: number[];
  limit: number;
  page: number;
  validationFleet: number;
  timeInit: string;
  timeEnd: string;
}