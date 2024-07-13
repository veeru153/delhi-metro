import StationPickerInput from "./StationPickerInput";
import FilterButton from "./FilterButton";
import { MINIMUM_INTERCHANGE, SHORTEST_ROUTE } from "../common/constants";
import { useAtom, useAtomValue } from "jotai";
import { filterAtom, fromStationAtom, toStationAtom } from "../common/atoms";
import { useNavigate } from "react-router-dom";

export default function JourneyPlanner() {
    const navigate = useNavigate();
    const from = useAtomValue(fromStationAtom);
    const to = useAtomValue(toStationAtom);
    const [filter, setFilter] = useAtom(filterAtom);

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
            <button
                className="text-xl bg-red-700 text-gray-200 w-full py-3 rounded-lg cursor-pointer disabled:text-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={from == null || to == null || filter == null}
                onClick={() => (from != null && to != null && navigate("/route"))}
            >
                Show Route & Fare
            </button>
        </div>
    </>
}