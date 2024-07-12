import { useState } from "react";
import StationPickerInput from "./StationPickerInput";
import FilterButton from "./FilterButton";
import { MINIMUM_INTERCHANGE, SHORTEST_ROUTE } from "../common/constants";
import { useAtomValue } from "jotai";
import { fromStationAtom, toStationAtom } from "../common/atoms";

export default function JourneyPlanner() {
    const from = useAtomValue(fromStationAtom);
    const to = useAtomValue(toStationAtom);
    const [filter, setFilter] = useState(SHORTEST_ROUTE);

    return <>
        <div className="flex flex-col justify-center items-center gap-y-3 w-4/5 mx-auto">
            <p className="text-2xl my-2">Plan Your Journey</p>
            <div className="flex flex-col items-center w-full gap-y-3">
                <StationPickerInput label="From" stationAtom={fromStationAtom} />
                <StationPickerInput label="To" stationAtom={toStationAtom} />
            </div>
            <div className="flex flex-row justify-center gap-x-2 w-full">
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
            <div className="text-xl bg-red-700 text-gray-200 w-full py-3 rounded-lg cursor-pointer">
                Show Route & Fare
            </div>
        </div>
    </>
}