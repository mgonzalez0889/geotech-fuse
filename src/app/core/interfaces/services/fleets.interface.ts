export interface FleetInterface {
  id: number;
  name: string;
  description: string;
  user_id: number;
  owner_id: number;
  selected: boolean;
  plates: any[];
}
