/* eslint-disable @typescript-eslint/naming-convention */
/***** para manejar la data en MatDialog ****/
export interface IDialogData<T> {
  action: EnumDialogAction;
  name?: string;
  data?: T;
  isEdit?: boolean;
}

export enum EnumDialogAction {
  create = 'CREATE',
  edit = 'EDIT',
}

export enum EnumDialogScreen {
  xs_per = '200px',
  s_per = '400px',
  m_per = '800px',
  l_per = '1024px'
}
export interface IDialogAlertResult {
  value?: boolean;
  cancel?: boolean;
  other?: boolean;
}

export interface IDialogAlert {
  action?: string;
  title?: string;
  text?: string;
  html?: string;
  type?: string;
  showCloseButton?: boolean;
  showCancelButton?: boolean;
  showConfirButton?: boolean;
  showOtherButton?: boolean;
  disableClose?: boolean;
  closeOnNavigation?: boolean;
  textCancelButton?: string;
  textConfirButton?: string;
  textOtherButton?: string;
}

export enum DialogAlertEnum {
  success = 'check_circle',
  error = 'cancel',
  warning = 'pan_tool',
  info = 'info',
  question = 'help_outline',
}

export interface ConfirmationConfig {
  title?: string;
  message?: string;
  icon?: {
    show?: boolean;
    name?: string;
    color?:
    | 'primary'
    | 'accent'
    | 'warn'
    | 'basic'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
  };
  actions?: {
    confirm?: {
      show?: boolean;
      label?: string;
      color?:
      | 'primary'
      | 'accent'
      | 'warn';
    };
    cancel?: {
      show?: boolean;
      label?: string;
    };
  };
  dismissible?: boolean;
}
