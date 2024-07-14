import { useEffect, useState } from "react";
import stationRoute from "../api/stationRoute";
import { MINIMUM_INTERCHANGE, SHORTEST_ROUTE } from "../common/constants";
import { useQuery } from "@tanstack/react-query";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import DirectionsSubwayOutlinedIcon from '@mui/icons-material/DirectionsSubwayOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { useAtom, useAtomValue } from "jotai";
import { filterAtom, fromStationAtom, toStationAtom } from "../common/atoms";
import StationPickerInput from "../components/StationPickerInput";
import FilterButton from "../components/FilterButton";
import { RouteDetails, RouteSegment, RouteSegmentStation } from "../common/types/StationRoute";
import getColorFromLineNo from "../common/util/getColorFromLine";
import { useNavigate } from "react-router-dom";


export default function RouteInfo() {
    const navigate = useNavigate();
    const from = useAtomValue(fromStationAtom);
    const to = useAtomValue(toStationAtom);
    const [filter, setFilter] = useAtom(filterAtom);

    if (from == null || to == null || filter == null ||
        ![SHORTEST_ROUTE, MINIMUM_INTERCHANGE].includes(filter))
        return <InvalidParameters />

    const { data, refetch, isLoading, isError } = useQuery({
        queryKey: ["stationRoute", from, to, filter],
        queryFn: async () => {
            return await stationRoute(from.station_code, to.station_code, filter);
        }
    })

    useEffect(() => {
        refetch();
    }, [from, to, filter])

    function getBottomScreen() {
        if (from?.station_code == to?.station_code) return <ErrorState message="Journey Source and Destination cannot be the same" />
        if (isLoading) return <LoadingState />
        if (data == null || isError) return <ErrorState />
        return <JourneyDetails data={data} />
    }

    const mapPaths: string[] = [];
    if (data != null) {
        data.route.forEach(route => route["map-path"].forEach(path => mapPaths.push(path)));
    }
    const mapUrl = `/map${mapPaths.length != 0 ? `?route=${mapPaths.join(",")}` : ""}`

    return <>
        <div className="flex flex-col h-screen gap-y-3">
            <div className="flex flex-row w-full">
                <div className="flex flex-row flex-1 items-center p-4 gap-2">
                    <div
                        className="cursor-pointer"
                        onClick={() => navigate("/")}
                    >
                        <ArrowBackIosNewOutlinedIcon className="!w-6 !h-6 text-gray-800" />
                    </div>
                    <p className="text-xl">Journey</p>
                </div>
                <div
                    className="flex flex-row justify-center items-center p-4 cursor-pointer"
                    onClick={() => navigate(mapUrl)}
                >
                    <MapOutlinedIcon className="!w-7 !h-7 text-gray-800" />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col w-full gap-y-3 px-3">
                    <div className="flex flex-row w-full items-center gap-x-1">
                        <StationPickerInput hideIcon label="From" stationAtom={fromStationAtom} />
                        <KeyboardDoubleArrowRightOutlinedIcon />
                        <StationPickerInput hideIcon label="To" stationAtom={toStationAtom} />
                    </div>
                    <div className="flex flex-row w-full gap-2">
                        <FilterButton
                            label="Shortest Route"
                            isActive={filter == SHORTEST_ROUTE}
                            setActive={() => setFilter(SHORTEST_ROUTE)}
                        />
                        <FilterButton
                            label="Minimum Interchange"
                            isActive={filter == MINIMUM_INTERCHANGE}
                            setActive={() => setFilter(MINIMUM_INTERCHANGE)}
                        />
                    </div>
                </div>
            </div>
            {getBottomScreen()}
        </div>
    </>;
}

function JourneyDetails({ data }: { data: RouteDetails }) {
    const segments = data.route;

    function getTimeString() {
        const [h, m, s] = data.total_time.split(":").map(i => parseInt(i));
        const minFromSec = Math.round(s / 60);
        const minFromHours = h * 60;
        return m + minFromSec + minFromHours;
    }

    return <>
        <div className="flex flex-col flex-1 w-full px-3 gap-y-3">
            <div className="flex flex-row justify-between text-xl px-2">
                <p>{data.stations} Stops</p>
                <p>₹ {data.fare}</p>
                <p>{getTimeString()} Mins</p>
            </div>
            <div className="flex flex-col gap-y-4">
                {segments.map((segment, index) => (
                    <JourneySegment
                        segment={segment}
                        nextSegment={index !== segments.length - 1 ? segments[index + 1] : null}
                    />
                ))}
            </div>
        </div>
    </>
}

function JourneySegment({ segment, nextSegment }: JourneySegmentProps) {
    const stations = segment.path
    const startStation = stations[0];
    const endStation = stations[stations.length - 1];
    const intermediateStations = stations.slice(1, -1);
    const lineColor = getColorFromLineNo(segment.line_no);
    const nextLineColor = nextSegment != null ? getColorFromLineNo(nextSegment.line_no) : "#000";

    return <>
        <div className="flex flex-col bg-gray-200 rounded-2xl py-3 gap-y-0.5 text-lg">
            <TerminalStation station={startStation} color={lineColor} />
            {intermediateStations.length > 0 ? <IntermediateStations stations={intermediateStations} color={lineColor} /> : null}
            <TerminalStation station={endStation} color={lineColor} end />
        </div>
        {
            nextSegment != null
                ? <div className="flex flex-row justify-center items-center gap-x-4 text-lg font-bold">
                    <div className="flex-1 text-right" style={{ color: lineColor }}>{segment.line}</div>
                    <SwapHorizOutlinedIcon className="text-gray-900" />
                    <div className="flex-1 text-left" style={{ color: nextLineColor }}>{nextSegment.line}</div>
                </div>
                : null
        }
    </>
}

function TerminalStation({ station, color, end = false }: { station: RouteSegmentStation, color: string, end?: boolean }) {
    const terminalRoundingClass = end ? "rounded-b-2xl" : "rounded-t-2xl";
    const terminalAlignmentClass = end ? "justify-start" : "justify-end";
    const lineClasses = ["flex flex-col w-4 ml-4 mr-2", terminalAlignmentClass].join(" ");

    return <>
        <div className="flex flex-row">
            <div className={lineClasses}>
                <div
                    className={`w-2 h-4/5 mx-auto ${terminalRoundingClass}`}
                    style={{ backgroundColor: color }}
                />
            </div>
            <div className="py-1">{station.name}</div>
        </div>
    </>
}

function IntermediateStations({ stations, color }: { stations: RouteSegmentStation[], color: string }) {
    const [showIntermediate, setShowIntermediate] = useState(false);

    return <>
        <div className="flex flex-row">
            <div className="w-4 ml-4 mr-2">
                <div className="w-2 h-full mx-auto" style={{ backgroundColor: color }} />
            </div>
            <div className="flex flex-col text-left">
                <div className="flex flex-row items-center gap-x-0.5 cursor-pointer" onClick={() => setShowIntermediate(!showIntermediate)}>
                    {showIntermediate ? <ExpandLessOutlinedIcon className="text-gray-800" /> : <ExpandMoreOutlinedIcon className="text-gray-800" />}
                    {showIntermediate ? "Hide" : "Show"} {stations.length} Stations
                </div>
                <div className="flex flex-col mt-1 ml-8 mr-2 gap-y-2.5">
                    {showIntermediate && stations.map(station => <div>{station.name}</div>)}
                </div>
            </div>
        </div>
    </>
}

function InvalidParameters() {
    const navigate = useNavigate();

    return <>
        <div className="flex flex-col h-screen">
            <div className="flex flex-row w-full">
                <div
                    className="flex flex-row items-center p-4 gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <ArrowBackIosNewOutlinedIcon className="!w-6 !h-6 text-gray-800" />
                    <p className="text-xl">Back</p>
                </div>
            </div>
            <div className="flex flex-col flex-1 justify-center items-center px-4 gap-8">
                <ErrorOutlineOutlinedIcon className="!w-44 !h-44 text-gray-400" />
                <p className="text-3xl text-gray-400">Missing or Invalid Route Data</p>
            </div>
        </div>
    </>
}

function LoadingState() {
    return <>
        <div className="flex flex-col flex-1 justify-center items-center px-4 gap-y-4">
            <DirectionsSubwayOutlinedIcon className="!w-44 !h-44 text-gray-400" />
            <p className="text-3xl text-gray-400">Finding Route</p>
        </div>
    </>
}

function ErrorState({ message }: { message?: string }) {
    return <>
        <div className="flex flex-col flex-1 justify-center items-center px-4 gap-y-4">
            <ReportProblemOutlinedIcon className="!w-44 !h-44 text-gray-400" />
            <p className="text-3xl text-gray-400">{message ?? "Error Fetching Data"}</p>
        </div>
    </>
}

interface JourneySegmentProps {
    segment: RouteSegment;
    nextSegment?: RouteSegment | null;
}