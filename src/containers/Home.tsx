import JourneyPlanner from "../components/JourneyPlanner";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
// @ts-ignore
import DmrcLogo from "../assets/dmrc-logo.svg?react";
import { Link } from "react-router-dom";

export default function Home() {
    return <>
        <div className="flex flex-col justify-center items-center h-screen gap-y-10">
            <DmrcLogo />
            <JourneyPlanner />
            <div className="flex flex-row w-4/5 mx-auto gap-x-4">
                <a
                    className="flex flex-row flex-1 justify-center items-center bg-red-300 gap-x-2 py-4 rounded-xl"
                    href="https://www.delhimetrorail.com/faq"
                    target="_blank"
                >
                    <HelpOutlineOutlinedIcon className="!w-5 !h-5 text-gray-800" />
                    <div className="text-lg">FAQs</div>
                </a>
                <Link className="flex flex-row flex-1 justify-center items-center bg-red-300 gap-x-2 py-4 rounded-xl" to="/map">
                    <MapOutlinedIcon className="!w-5 !h- text-gray-800" />
                    <div className="text-lg">Map</div>
                </Link>
            </div>
            <div className="flex flex-col w-4/5 gap-y-3">
                <p>Disclaimer: Not affiliated with the <a href="https://www.delhimetrorail.com" target="_blank" className="hover:underline">Delhi Metro (DMRC)</a>. All related assets are owned by their respective owners.</p>
                <p>Made with ❤️ by <a href="https://github.com/veeru153" target="_blank" className="hover:underline">veeru153</a></p>
            </div>
        </div>
    </>
}