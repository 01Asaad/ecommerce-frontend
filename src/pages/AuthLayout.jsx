import { Outlet } from "react-router-dom";
// import GlobalNavBar from "../components/GlobalNavBar";

export default function AuthLayout() {
    return (
        <div className='flex w-screen h-screen dark:bg-gray-800'>
            <div className='w-1/2 bg-blue-400'></div>
            <div className="w-1/2 flex flex-col justify-center items-center">
                <Outlet>
                    
                </Outlet>
            </div>
        </div>
    );
}