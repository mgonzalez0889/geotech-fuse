export interface IOptionTable {
  name: string;
  text: string;
  typeField: 'text' | 'percentage' | 'date';
  classTailwind?: string;
}

export interface IButtonOptions<T> {
  icon: string;
  text: string;
  action: (data: T) => void;
}

export type PipeDataTable = {
  [key: string]: (value: any) => string;
};
