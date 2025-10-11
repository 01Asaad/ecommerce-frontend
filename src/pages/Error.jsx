import React from "react";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError();
	console.error('Router Error:', error);
	const title = error?.statusText || error?.title
	const errorMessage = error?.message || error?.data
	const message = error?.status === 404 ? "The URL or asset you are trying to access couldn't be found." : errorMessage
	return (
		<div className="flex flex-col justify-center items-center h-screen space-y-7">
			<h1 className="text-7xl font-bold">{title || (errorMessage & error?.status !== 404 ? "Error" : "Not found.")}</h1>
			<div className="my-6">
				<h3 className="text-2xl ">{message}</h3>
			</div>
			<div className="my-10">
				<Link to="/" className="text-blue-500 underline hover:text-blue-400">Back to Home</Link>
			</div>
		</div>
	)
}