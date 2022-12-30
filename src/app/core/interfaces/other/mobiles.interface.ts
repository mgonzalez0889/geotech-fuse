/* eslint-disable @typescript-eslint/naming-convention */
export interface IMobiles {
  id: number;
  plate: string;
  code: string;
  address: string;
  x: string;
  y: string;
  speed: number;
  status_mobile: boolean;
  heading: string;
  owner_plate_id: number;
  class_mobile_id: number;
  class_mobile_name: string;
  imei: string;
  device: number;
  battery: null;
  selected?: boolean;
  color?: string;
}
