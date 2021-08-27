export interface MenuNavigationInterface {
    id:                 number;
    icon:               string;
    id_father:          number;
    option_create:      null;
    option_delete:      number;
    option_description: string;
    option_name:        string;
    option_read:        number;
    option_ubication:   string;
    option_update:      number;
    option_view:        null;
    created_at:         Date;
    updated_at:         Date;
    sons:               Son[];
}
export interface Son {
    id:                 number;
    option_view:        null;
    icon:               string;
    option_name:        string;
    option_description: string;
    option_ubication:   string;
    option_create:      number;
    option_read:        number;
    option_update:      number;
    option_delete:      number;
    characteristics:    any[];
}
