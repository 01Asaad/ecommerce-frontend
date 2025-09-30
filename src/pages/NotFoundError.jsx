import React from "react";
import { useRouteError } from "react-router-dom";

export default function NotFoundErrorPage() {
    const error = useRouteError();
    console.error('Router Error:', error);
    return (
        <div className="flex flex-col justify-center items-center my-10">
            <h1 className="text-7xl">Not found.</h1>
            <div className="my-6">
                <h3 className="text-2xl">The URL or asset you are trying to access could not be found.</h3>
            </div>
        </div>
    )
}