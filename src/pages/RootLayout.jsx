import { Outlet, useNavigation, useFetchers } from "react-router-dom";
import GlobalNavBar from "../components/GlobalNavBar";
import LoadingBar from "../components/UI/LoadingBar"
import { useUser } from "../context/UserProvider";
import { useIsFetching } from '@tanstack/react-query';

export default function RootLayout() {
    const navigation = useNavigation()
    const queriesFetchingLen = useIsFetching()
    const userCtx = useUser()
    const fetchers = useFetchers()
    const isAnyFetcherLoading = fetchers.some(fetcher =>
        fetcher.state !== "idle"
    );
    const isLoading = userCtx.isLoading || navigation.state !== "idle" || isAnyFetcherLoading || queriesFetchingLen
    return (<>
        <header className="sticky top-0 z-50">
            <GlobalNavBar />
            <LoadingBar isLoading={isLoading} ></LoadingBar>
        </header>
        <Outlet></Outlet>
    </>
    )
}