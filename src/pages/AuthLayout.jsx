import { Outlet } from "react-router-dom";
import useTWBreakpoints from "../hooks/useTWBreakpoints";

export default function AuthLayout() {
    const [breakpoint, doesWidthReach] = useTWBreakpoints()
    return doesWidthReach("sm") ? (
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
