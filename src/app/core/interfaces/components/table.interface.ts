export interface IOptionTable {
  name: string;
  text: string;
  typeField: 'text' | 'percentage' | 'date' | 'switch' | 'speed';
  defaultValue?: string;
  classTailwind?: string;
  color?: (data: any) => string;
}

export interface IButtonOptions<T> {
  icon: string;
  text: string;
  action: (data: T) => void;
}

export type PipeDataTable = {
  [key: string]: (value: any) => string;
};
