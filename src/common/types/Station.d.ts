export interface Station {
    id: string;
    station_name: string;
    station_code: string;
    station_facility: StationFacility[]
}

export interface StationFacility {
    name: string;
    class_name: string;
    image: {
        title: string;
        file: string;
    }
}