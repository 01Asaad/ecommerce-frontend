import { Outlet } from "react-router-dom";
import useTWBreakpoints from "../hooks/useTWBreakpoints";
// import GlobalNavBar from "../components/GlobalNavBar";

export default function AuthLayout() {
    const bp = useTWBreakpoints()
    return bp !== "xs" ? (
        <div className='flex w-screen h-screen dark:bg-gray-800'>
            <div className='w-1/2 bg-blue-400'></div>
            <div className="w-1/2 flex flex-col justify-center items-center">
                <Outlet>

                </Outlet>
            </div>
        </div>)
        : (<div className="flex flex-col justify-center items-center">
            <Outlet>

            </Outlet>
        </div>)
}
