export interface OptionCreateInterface {
    option_id: number;
    project_id: number;
    owner_id: number;
    user_profile_id: number;
}
export interface OptionProfileInterface {
    id?: number;
    icon?: string;
    id_father?: null;
    option_create?: number | boolean;
    option_delete?: number | boolean;
    option_description?: string;
    option_name?: string;
    option_read?: number | boolean;
    option_ubication?: string;
    option_update?: number | boolean;
    option_view?: number;
    created_at?: Date;
    updated_at?: Date;
}
