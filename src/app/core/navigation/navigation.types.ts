import { FuseNavigationItem } from '@fuse/components/navigation';
import {MenuNavigationInterface} from "../interfaces/menu-navigation.interface";

/*export interface Navigation
{
    compact: MenuNavigationInterface[];
    default: MenuNavigationInterface[];
    futuristic: MenuNavigationInterface[];
    horizontal: MenuNavigationInterface[];
}*/
export interface Navigation
{
    compact: FuseNavigationItem[];
    default: FuseNavigationItem[];
    futuristic: FuseNavigationItem[];
    horizontal: FuseNavigationItem[];
}
