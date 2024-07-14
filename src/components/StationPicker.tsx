import { Atom, useAtom } from "jotai";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Station } from "../common/types/Station";
import { useQuery } from "@tanstack/react-query";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import stationByKeyword from "../api/stationByKeyword";
import { pickerVisibleAtom } from "../common/atoms";

export default function StationPicker({ stationAtom }: StationPickerProps) {
    const searchBarRef = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>;
    const [pickerVisible, setPickerVisible] = useAtom(pickerVisibleAtom);
    const [_, setStation] = useAtom<Station | null>(stationAtom);
    const [keyword, setKeyword] = useState("");

    const { data, refetch, isError } = useQuery({
        queryKey: ["stationByKeyword", keyword],
        queryFn: async () => {
            return await stationByKeyword(keyword);
        },
        refetchOnWindowFocus: false,
        enabled: false
    })

    useEffect(() => {
        if (pickerVisible) searchBarRef.current.focus();
    }, [pickerVisible])

    useEffect(() => {
        if (keyword.length != 0) refetch();
    }, [keyword])

    function resetPicker() {
        searchBarRef.current.value = "";
        setKeyword("");
        setPickerVisible(false);
    }

    function getBottomScreen() {
        if (keyword.length == 0) return <StartTypingToSearch />;
        if (isError) return <ErrorScreen />;
        return <StationList list={data ?? []} setStation={setStation} resetPicker={resetPicker} />
    }

    const activeClasses = "translate-x-0 sm:flex";
    const inactiveClasses = "translate-x-full sm:translate-x-0 sm:hidden";
    const classes = [
        "fixed top-0 flex flex-col h-screen pt-4 px-4 w-full max-w-[640px] mx-auto transition-transform duration-100 ease-out bg-white",
        pickerVisible ? activeClasses : inactiveClasses
    ].join(" ")

    return <>
        <div className="flex flex-row sm:w-full">
            <div className={classes}>
                <div className="flex flex-row justify-center items-center w-full mx-auto gap-x-2">
                    <div className="flex flex-row justify-center items-center cursor-pointer pr-2">
                        <ArrowBackIosNewOutlinedIcon className="text-gray-800" onClick={resetPicker} />
                    </div>
                    <div className="flex flex-row bg-gray-200 w-full px-3 py-3 gap-x-3 rounded-xl">
                        <SearchOutlinedIcon className="text-gray-700" />
                        <input
                            ref={searchBarRef}
                            placeholder="Search"
                            className="text-gray-800 bg-transparent w-full focus:outline-none"
                            onInput={(e) => setKeyword((e.target as HTMLInputElement).value)}
                        />
                    </div>
                </div>
                {getBottomScreen()}
            </div>
        </div>
    </>
}

function StartTypingToSearch() {
    return <>
        <div className="flex flex-col flex-1 justify-center items-center gap-2 text-center">
            <SearchOutlinedIcon className="!w-44 !h-44 text-gray-400" />
            <p className="text-3xl text-gray-400">Start Typing to Search</p>
        </div>
    </>
}

function ErrorScreen() {
    return <>
        <div className="flex flex-col flex-1 justify-center items-center gap-2">
            <ErrorOutlineOutlinedIcon className="!w-44 !h-44 text-gray-400" />
            <p className="text-3xl text-gray-400">Error Fetching Stations</p>
        </div>
    </>
}

function StationList({ list, setStation, resetPicker }: StationList) {
    return <>
        <div className="flex flex-col flex-1 gap-y-3 pt-4">
            {list.map(station => (
                <StationListItem
                    key={station.id}
                    station={station}
                    setStation={setStation}
                    resetPicker={resetPicker}
                />))}
        </div>
    </>
}

function StationListItem({ station, setStation, resetPicker }: StationListItem) {
    return <>
        <div
            className="flex flex-row bg-gray-200 rounded-xl py-3 px-4 text-lg text-left cursor-pointer"
            onClick={() => {
                setStation(station);
                resetPicker();
            }}
        >
            <p>{station?.station_name ?? "FALLBACK_STATION"}</p>
        </div>
    </>
}

interface StationPickerProps {
    stationAtom: Atom<Station | null>;
}

interface StationList {
    list: Station[];
    setStation: Function;
    resetPicker: Function;
}

interface StationListItem {
    station: Station;
    setStation: Function;
    resetPicker: Function;
}