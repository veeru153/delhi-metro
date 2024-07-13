import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Station } from '../common/types/Station';
import { Atom, useAtomValue, useSetAtom } from 'jotai';
import { pickerVisibleAtom, searchingStationAtom } from '../common/atoms';

export default function StationPickerInput({ label, hideIcon = false, stationAtom }: StationPickerProps) {
    const station = useAtomValue(stationAtom);
    const setSearchingStationAtom = useSetAtom(searchingStationAtom);
    const setPickerVisible = useSetAtom(pickerVisibleAtom);
    const labelClass = station == null ? "text-gray-500" : "text-gray-900";
    const textboxClasses = [labelClass, "truncate"].join(" ")

    return <>
        <div
            className="flex flex-row w-full bg-gray-200 px-3 py-3 gap-x-3 rounded-xl cursor-pointer truncate"
            onClick={() => {
                setSearchingStationAtom(stationAtom);
                setPickerVisible(true);
            }}
        >
            {!hideIcon && <PlaceOutlinedIcon className={labelClass} />}
            <p className={textboxClasses}>{station?.station_name ?? label}</p>
        </div>
    </>
}

interface StationPickerProps {
    label?: string;
    hideIcon?: boolean;
    stationAtom: Atom<Station | null>;
}