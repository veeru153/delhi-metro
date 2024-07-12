import JourneyPlanner from "../components/JourneyPlanner";
import StationPicker from "../components/StationPicker";
import { searchingStationAtom } from "../common/atoms";
import { useAtomValue } from "jotai";

export default function Home() {
    const searchingStation = useAtomValue(searchingStationAtom);

    return <>
        <JourneyPlanner />
        <StationPicker stationAtom={searchingStation} />
    </>
}