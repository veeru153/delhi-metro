import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import { Station } from '../common/types/Station';
import { Atom, useAtomValue, useSetAtom } from 'jotai';
import { pickerVisibleAtom, searchingStationAtom } from '../common/atoms';

export default function StationPickerInput({ label, stationAtom }: StationPickerProps) {
    const station = useAtomValue(stationAtom);
    const setSearchingStationAtom = useSetAtom(searchingStationAtom);
    const setPickerVisible = useSetAtom(pickerVisibleAtom);
    const labelClass = station == null ? "text-gray-500" : "text-gray-900";

    return <>
        <div
            className="flex flex-row w-full bg-gray-200 px-3 py-3 gap-x-3 rounded-xl cursor-pointer"
            onClick={() => {
                setSearchingStationAtom(stationAtom);
                setPickerVisible(true);
            }}
        >
            <PlaceOutlinedIcon className={labelClass} />
            <p className={labelClass}>{station?.station_name ?? label}</p>
        </div>
    </>
}

interface StationPickerProps {
    label: string;
    stationAtom: Atom<Station | null>;
}