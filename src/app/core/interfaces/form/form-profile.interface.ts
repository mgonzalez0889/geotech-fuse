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
  createOption: boolean;
  editOption: boolean;
  deleteOption: boolean;
}

export interface IOptionPermission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}
