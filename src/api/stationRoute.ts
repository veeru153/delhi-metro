import { DateTime } from "luxon";
import { ENDPOINTS } from "../common/constants";
import { RouteDetails } from "../common/types/StationRoute";

export default async function stationRoute(from: string, to: string, filter: string): Promise<RouteDetails> {
    let time = DateTime.now().setZone("Asia/Kolkata").toISO();
    time = time?.substring(0, time.length - 6) ?? new Date().toISOString();
    const url = [ENDPOINTS.STATION_ROUTE, from, to, filter, time].join("/");

    const res = await fetch(url, {
        "referrer": "https://delhimetrorail.com/",
        "referrerPolicy": "strict-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    });
    const data = await res.json();
    return data;
}