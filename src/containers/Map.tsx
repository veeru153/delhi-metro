import { useNavigate } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
// @ts-ignore
import MapSvg from "../assets/map.svg?react";


export default function Map() {
    const navigate = useNavigate();
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
            <div className="flex flex-1 overflow-hidden">
                <MapSvg />
            </div>
        </div>
    </>
}