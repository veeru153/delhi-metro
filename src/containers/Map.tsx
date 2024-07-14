import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
// @ts-ignore
import MapSvgImg from "../assets/map.svg?react";
import MapSvg from "../components/MapSvg";
import { useLayoutEffect, useRef } from "react";

const ORIGINAL_X = -366.2540008544922;
const ORIGINAL_Y = -11.287689208984375;
const ORIGINAL_SCALE = 0.7

export default function Map() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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
    const viewBox = { x: 7.944935326437348, y: 84.7464617386605, w: 491, h: 758 };
    const newViewBox = { x: 0, y: 0, w: 0, h: 0 };
    let ratio = 1;

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

        newViewBox.x = Math.min(648, Math.max(viewBox.x - (xDiff * ratio), -420));
        newViewBox.y = Math.min(800, Math.max(viewBox.y - (yDiff * ratio), -36));

        const viewBoxStr = `${newViewBox.x} ${newViewBox.y} ${viewBox.w} ${viewBox.h}`;
        svgRef.current?.setAttribute("viewBox", viewBoxStr);
    }

    function onPointerUp() {
        isPointerDown = false;
        viewBox.x = newViewBox.x;
        viewBox.y = newViewBox.y;
    }

    function onWheelMove(event: WheelEvent) {
        const scaleDiff = event.deltaY / 1000;

        viewBox.w = Math.min(491, Math.max(viewBox.w * (1 + scaleDiff), 120));
        viewBox.h = Math.min(758, Math.max(viewBox.h * (1 + scaleDiff), 120 * (758 / 491)));

        if (viewBox.w === 491 || viewBox.h === 758) {
            viewBox.x = 0;
            viewBox.y = 0;
        }

        const viewBoxStr = `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`;
        ratio = ref.current != null ? viewBox.w / ref.current.getBoundingClientRect().width : 1;

        svgRef.current?.setAttribute("viewBox", viewBoxStr);
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

        ratio = ref.current != null ? viewBox.w / ref.current.getBoundingClientRect().width : 1;
        window.addEventListener('resize', function () {
            ratio = ref.current != null ? viewBox.w / ref.current.getBoundingClientRect().width : 1;
        });
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
            <div className="flex flex-1 justify-center items-center overflow-hidden" ref={ref}>
                <MapSvg x={ORIGINAL_X} y={ORIGINAL_Y} scale={ORIGINAL_SCALE} ref={svgRef} />
            </div>
        </div>
    </>
}