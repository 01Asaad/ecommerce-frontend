import { Outlet } from "react-router-dom";
import GlobalNavBar from "../components/GlobalNavBar";

export default function RootLayout() {
    return (<>
        <header className="">
            <GlobalNavBar />
        </header>
        <Outlet></Outlet>
    </>
    )
}