import { ENDPOINTS } from "../common/constants";
import { Station } from "../common/types/Station";

export default async function stationByKeyword(keyword: string): Promise<Station[]> {
    const url = [ENDPOINTS.STATION_BY_KEYWORD, keyword].join("/");
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