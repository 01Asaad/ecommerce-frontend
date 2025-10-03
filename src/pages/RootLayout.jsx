import { Outlet } from "react-router-dom";
import GlobalNavBar from "../components/GlobalNavBar";

export default function RootLayout() {
    return (<>
        <header className="sticky top-0 z-50">
            <GlobalNavBar />
        </header>
        <Outlet></Outlet>
    </>
    )
}