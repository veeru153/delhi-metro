export interface RouteDetails {
    fare: number;
    from: string;
    from_station_status: StationStatus;
    message: string;
    route: RouteSegment[];
    stations: number;
    to: string;
    to_station_status: StationStatus;
    total_time: string;
}

export interface StationStatus {
    note: string;
    status: string;
    title: string;
}

export interface RouteSegment {
    direction: string;
    end: string;
    line: string;
    line_no: number;
    "map-path": string[];
    new_end_time: string;
    new_start_time: string;
    path: RouteSegmentStation[];
    path_time: string;
    platform_name: string;
    start: string;
    station_interchange_time: number;
    towards_station: string;
}

export interface RouteSegmentStation {
    name: string;
    status: string;
}