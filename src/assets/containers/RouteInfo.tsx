import { useEffect } from "react";
import { Station } from "../common/types/Station";
import stationRoute from "../api/stationRoute";
import { SHORTEST_ROUTE } from "../common/constants";

export default function RouteInfo() {

    useEffect(() => {
        async function test() {
            const data = await stationRoute("JPW", "DM", SHORTEST_ROUTE);
            console.log(data);
        }
        test();
    }, [])

    return <>
        <div>Route Info</div>
    </>;
}