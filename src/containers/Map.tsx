import { useNavigate } from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
// @ts-ignore
import MapSvgImg from "../assets/map.svg?react";
import MapSvg from "../components/MapSvg";
import { useState } from "react";


export default function Map() {
    const navigate = useNavigate();
    const [x, setX] = useState(-17.254000854492176);
    const [y, setY] = useState(143.71231079101562);
    const [scale, setScale] = useState(0.3);

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
            <div className="flex flex-1">
                <MapSvg x={x} y={y} scale={scale} />
            </div>
        </div>
    </>
}