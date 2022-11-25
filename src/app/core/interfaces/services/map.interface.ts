export interface IOptionPanelMap<T = any> {
  data: T;
  panel: 'history' | 'details' | 'commands' | 'none';
}
