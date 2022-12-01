export interface IOptionPanelMap<T = any> {
  data: T;
  panel: 'history' | 'details' | 'commands' | 'none';
}

export interface IOptionPanelGeotools {
  titlePanel: string;
  typePanel: 'routes' | 'zones' | 'punts' | 'owner_maps';
}
