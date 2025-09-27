import React from "react";

export default function NotFoundErrorPage() {
    return (
        <div className="flex flex-col justify-center items-center my-10">
            <h1 className="text-7xl">Not found.</h1>
            <div className="my-6">
                <h3 className="text-2xl">The URL or asset you are trying to access could not be found.</h3>
            </div>
        </div>
    )
}