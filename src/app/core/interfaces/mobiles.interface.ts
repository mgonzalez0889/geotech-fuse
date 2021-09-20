export interface MobilesInterface {
    id:             number;
    plate:          string;
    code:           string;
    address:        string;
    x:              string;
    y:              string;
    speed:          number;
    status_mobile:  boolean;
    heading:        string;
    owner_plate_id: number;
    imei:           string;
    device:         number;
    battery:        null;
    selected?:       boolean;
}
