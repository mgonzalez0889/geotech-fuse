/* eslint-disable @typescript-eslint/naming-convention */
export interface IFormProfile {
  name: string;
  description: string;
  plates: any[];
  fleets: any[];
  module: any[];
}

export interface IListModules {
  id: number;
  title: string;
  option: IOptionPermission;
  create_option: boolean;
  edit_option: boolean;
  delete_option: boolean;
}

export interface IOptionPermission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}
