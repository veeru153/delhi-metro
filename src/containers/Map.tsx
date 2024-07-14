import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
// @ts-ignore
import MapSvgImg from "../assets/map.svg?react";
import MapSvg from "../components/MapSvg";
import { useLayoutEffect, useRef, useState } from "react";

const ORIGINAL_X = -366.2540008544922;
const ORIGINAL_Y = -11.287689208984375;
const ORIGINAL_SCALE = 0.7

export default function Map() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [x, setX] = useState(ORIGINAL_X);
    const [y, setY] = useState(ORIGINAL_Y);
    const [scale, setScale] = useState(ORIGINAL_SCALE);

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

    const svgRef = useRef<SVGSVGElement>(null);
    const ref = useRef<HTMLDivElement>(null);

    let isPointerDown = false;
    const pointerOrigin = { x: 0, y: 0 };

    function getPointFromEvent(event: MouseEvent | TouchEvent) {
        const point = { x: 0, y: 0 };

        if ((event as TouchEvent).targetTouches) {
            point.x = (event as TouchEvent).targetTouches[0].clientX;
            point.y = (event as TouchEvent).targetTouches[0].clientY;
        } else {
            point.x = (event as MouseEvent).clientX;
            point.y = (event as MouseEvent).clientY;
        }

        return point;
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
        isPointerDown = true;
        const pointerPosition = getPointFromEvent(event);
        pointerOrigin.x = pointerPosition.x;
        pointerOrigin.y = pointerPosition.y;
    }

    function onPointerMove(event: MouseEvent | TouchEvent) {
        if (!isPointerDown) return;
        event.preventDefault();
        const pointerPosition = getPointFromEvent(event);
        const xDiff = pointerPosition.x - pointerOrigin.x;
        const yDiff = pointerPosition.y - pointerOrigin.y;

        // TODO: Update min max based on zoom levels
        setX(Math.max(-2700, Math.min(x + xDiff, 221)));
        setY(y + yDiff);
        // setY(Math.max(-2458, Math.min(y + yDiff, -1696)));
    }

    function onPointerUp(event: MouseEvent | TouchEvent) {
        isPointerDown = false;
    }

    function onWheelMove(event: WheelEvent) {
        const scaleDiff = event.deltaY / 1000;
        setScale(Math.max(0.7, Math.min(scale - scaleDiff, 2.5)));
        if (scale === ORIGINAL_SCALE) {
            setX(ORIGINAL_X);
            setY(ORIGINAL_Y);
        }
    }

    useLayoutEffect(() => {
        // Add all mouse events listeners fallback
        ref.current?.addEventListener('mousedown', onPointerDown); // Pressing the mouse
        ref.current?.addEventListener('mouseup', onPointerUp); // Releasing the mouse
        ref.current?.addEventListener('mouseleave', onPointerUp); // Mouse gets out of the SVG area
        ref.current?.addEventListener('mousemove', onPointerMove); // Mouse is moving
        ref.current?.addEventListener('wheel', onWheelMove)

        // Add all touch events listeners fallback
        ref.current?.addEventListener('touchstart', onPointerDown); // Finger is touching the screen
        ref.current?.addEventListener('touchend', onPointerUp); // Finger is no longer touching the screen
        ref.current?.addEventListener('touchmove', onPointerMove); // Finger is moving
    })

    useLayoutEffect(() => {
        console.log("Repainting Route");
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
    }, [])

    return <>
        <div className="flex flex-col h-screen">
            <div className="flex flex-row w-full bg-white">
                <div className="flex flex-row flex-1 items-center p-4 gap-2">
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIosNewOutlinedIcon className="!w-6 !h-6 text-gray-800" />
                    </div>
                    <p className="text-xl">Map</p>
                </div>
            </div>
            <div className="flex flex-1 justify-center items-center" style={{ maxHeight: "90vh" }} ref={ref}>
                <MapSvg x={x} y={y} scale={scale} ref={svgRef} />
            </div>
        </div>
    </>
}