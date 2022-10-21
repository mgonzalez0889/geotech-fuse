export interface IOptionTable {
    name: string;
    text: string;
    typeField: 'text' | 'percentage' | 'date';
}

export interface IButtonTable {
    icon: string;
    text: string;
}

export type PipeDataTable = {
    [key: string]: (value: any) => string;
};
