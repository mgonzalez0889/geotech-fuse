export interface IOptionTable {
    name: string;
    text: string;
    typeField: 'text' | 'percentage' | 'date';
}

export type PipeDataTable = {
    [key: string]: (value: any) => string;
};
