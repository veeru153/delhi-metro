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
import { useAtom, useAtomValue } from "jotai";
import { filterAtom, fromStationAtom, toStationAtom } from "../common/atoms";
import StationPickerInput from "../components/StationPickerInput";
import FilterButton from "../components/FilterButton";
import { RouteDetails, RouteSegment, RouteSegmentStation } from "../common/types/StationRoute";
import getColorFromLineNo from "../common/getColorFromLine";


export default function RouteInfo() {
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

    console.log(data);


    if ((!isLoading && data == null) || isError) {
        return <>Error: 500</>
    }

    return <>
        <div className="flex flex-col h-screen gap-y-3">
            <div className="flex flex-row items-center p-4 pb-1 gap-2 cursor-pointer">
                <ArrowBackIosNewOutlinedIcon className="!w-6 !h-6 text-gray-800" />
                <p className="text-xl">Journey</p>
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
            {data != null && <JourneyDetails data={data} />}
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
                ? <div className="flex flex-row justify-center items-center gap-x-4 text-lg font-semibold">
                    <p style={{ color: lineColor }}>{segment.line}</p>
                    <SwapHorizOutlinedIcon />
                    <p style={{ color: nextLineColor }}>{nextSegment.line}</p>
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
                <div className="flex flex-row items-center gap-x-0.5" onClick={() => setShowIntermediate(!showIntermediate)}>
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
    return <>
        <div className="flex flex-col h-screen">
            <div className="flex flex-row w-full">
                <div className="flex flex-row items-center p-4 gap-2 cursor-pointer">
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

interface JourneySegmentProps {
    segment: RouteSegment;
    nextSegment?: RouteSegment | null;
}