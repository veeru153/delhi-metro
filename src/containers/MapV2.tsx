import { useSearchParams } from "react-router-dom";
// @ts-ignore
import MapSvgImg from "../assets/map.svg?react";
import MapSvg2 from "../components/MapSvg2";
import { useEffect, useLayoutEffect, useRef } from "react";

const ORIGINAL_X = -366.2540008544922;
const ORIGINAL_Y = -11.287689208984375;
const ORIGINAL_SCALE = 0.7

export default function Map() {
    const [searchParams] = useSearchParams();
    const svgRef = useRef<SVGSVGElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (svgRef && svgRef.current) {
            const bbox = svgRef.current.getBBox();
            svgRef.current.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
            svgRef.current.setAttribute("style", "width: 100%; height: 100%;");
        }
    }, [svgRef])

    const routePath = searchParams.get("route");
    const routePathCodes: string[] = [];
    const routeStationCodes: string[] = [];

    if (routePath != null) {
        routePath.split(",").forEach((path, i, arr) => {
            const splitPath = path.split("-");
            routeStationCodes.push(splitPath[0]);
            if (i === arr.length - 1) {
                routeStationCodes.push(splitPath[1]);
            }
            const reversePath = splitPath.reverse().join("-");
            routePathCodes.push(path, reversePath);
        })
    }

    useLayoutEffect(() => {
        if (routePath != null) {
            const lineSelector = `g.lines > line:not(${routePathCodes.map(code => "#" + code).join(",")})`;
            const lines = svgRef.current?.querySelectorAll(lineSelector);
            lines?.forEach(line => line.setAttribute("stroke", "#eeeeee"));

            const stationsGroup = svgRef.current?.querySelector("g.stations");
            const stationSelector = `g:not(${routeStationCodes.map(code => "#" + code).join(",")})`;
            const stations = stationsGroup?.querySelectorAll(stationSelector);
            stations?.forEach(station => (station.firstChild as Element).setAttribute("stroke", "#eeeeee"));

            const transferStationsGroup = svgRef.current?.querySelector("g.transferStations");
            const transferStations = transferStationsGroup?.querySelectorAll(stationSelector);
            transferStations?.forEach(station => (station.firstChild as Element).setAttribute("stroke", "#eeeeee"));

            const interchangesGroup = svgRef.current?.querySelector("g.interchanges");
            const interchanges = interchangesGroup?.querySelectorAll(stationSelector);
            interchanges?.forEach(station => (station.firstChild as Element).setAttribute("stroke", "#eeeeee"));
        }
    }, [])

    return <>
        <div className="flex flex-col h-dvh">
            <div className="relative flex flex-1 justify-center items-center overflow-hidden" ref={ref}>
                <MapSvg2 x={ORIGINAL_X} y={ORIGINAL_Y} scale={ORIGINAL_SCALE} ref={svgRef} />
            </div>
        </div>
    </>
}