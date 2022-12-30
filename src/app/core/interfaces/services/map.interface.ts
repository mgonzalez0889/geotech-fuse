export type TypeGeotool = 'routes' | 'zones' | 'punts' | 'owner_maps' | 'none';
export type PanelMain = 'history' | 'details' | 'commands' | 'none';

export interface IOptionPanelMap<T = any> {
  data: T;
  panel: PanelMain;
}

export interface IOptionPanelGeotools {
  titlePanel: string;
  typePanel: TypeGeotool;
}
