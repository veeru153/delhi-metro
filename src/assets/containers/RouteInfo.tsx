import { useEffect, useState } from "react";
import stationRoute from "../api/stationRoute";
import { MINIMUM_INTERCHANGE, SHORTEST_ROUTE } from "../common/constants";
import { useQuery } from "@tanstack/react-query";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useAtom, useAtomValue } from "jotai";
import { filterAtom, fromStationAtom, toStationAtom } from "../common/atoms";
import StationPickerInput from "../components/StationPickerInput";
import FilterButton from "../components/FilterButton";
import { RouteDetails, RouteSegment, RouteSegmentStation } from "../common/types/StationRoute";


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
    return <>
        <div className="flex flex-col flex-1 w-full px-3">
            <div className="flex flex-row justify-between text-xl px-2">
                <p>{data.stations} Stops</p>
                <p>₹ {data.fare}</p>
                <p>44 Mins</p>
            </div>
            <div className="flex flex-col gap-y-4">
                {data.route.map((segment, index) => <JourneySegment segment={segment} hasNext={index !== data.route.length - 1} />)}
            </div>
            {/* Station List */}
        </div>
    </>
}

function JourneySegment({ segment, hasNext = false }: JourneySegmentProps) {
    const stations = segment.path
    const startStation = stations[0];
    const endStation = stations[stations.length - 1];

    const intermediateStations = stations.slice(1, -1);


    return <>
        <div className="flex flex-col bg-gray-200 rounded-2xl py-3 gap-y-0.5 text-lg">
            <TerminalStation station={startStation} />
            {intermediateStations.length > 0 ? <IntermediateStations stations={intermediateStations} /> : null}
            <TerminalStation station={endStation} end />
        </div>
        {hasNext && <div>Interchange</div>}
    </>
}

function TerminalStation({ station, end = false }: { station: RouteSegmentStation, end?: boolean }) {
    const terminalRoundingClass = end ? "rounded-b-2xl" : "rounded-t-2xl";
    const terminalAlignmentClass = end ? "justify-start" : "justify-end";
    const lineClasses = ["flex flex-col w-4 ml-4 mr-2", terminalAlignmentClass].join(" ");

    return <>
        <div className="flex flex-row">
            <div className={lineClasses}>
                <div className={`w-2 h-4/5 mx-auto bg-red-300 ${terminalRoundingClass}`}></div>
            </div>
            <div className="py-1">{station.name}</div>
        </div>
    </>
}

function IntermediateStations({ stations }: { stations: RouteSegmentStation[] }) {
    const [showIntermediate, setShowIntermediate] = useState(false);

    return <>
        <div className="flex flex-row">
            <div className="w-4 ml-4 mr-2">
                <div className="w-2 h-full mx-auto bg-red-300"></div>
            </div>
            <div className="flex flex-col text-left">
                <div className="flex flex-row items-center gap-x-0.5" onClick={() => setShowIntermediate(!showIntermediate)}>
                    {showIntermediate ? <ExpandLessOutlinedIcon className="text-gray-800" /> : <ExpandMoreOutlinedIcon className="text-gray-800" />}
                    {showIntermediate ? "Hide" : "Show"} {stations.length} Stations
                </div>
                <div className="flex flex-col mt-1 mx-2.5 gap-y-2.5">
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
    hasNext?: boolean;
}